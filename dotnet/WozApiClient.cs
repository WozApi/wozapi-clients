using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace WozApi.Client;

/// <summary>
/// Client voor de WOZ API van woz-api.nl: WOZ-waarde, BAG-adresgegevens en kadastrale percelen
/// van elk Nederlands adres via 1 endpoint.
///
/// Bewust dun en zonder afhankelijkheden buiten de BCL, en bewust met een meegegeven
/// HttpClient: een eigen HttpClient per instantie is de klassieke bron van socket-uitputting
/// in langlopende processen. Gebruik IHttpClientFactory in ASP.NET.
///
/// Snel starten:
/// <code>
/// var client = new WozApiClient(httpClient, "jouw-api-key");
/// using var adres = await client.AdresAsync("Spuistraat 36C, 1012 TT Amsterdam");
/// var waarde = adres.RootElement.GetProperty("woz")[0].GetProperty("vastgesteldeWaarde");
/// </code>
/// </summary>
public sealed class WozApiClient
{
  private const string Versie = "1.0.0";
  private const string StandaardBasisUrl = "https://woz-api.nl";

  private readonly HttpClient _http;
  private readonly string _apiKey;
  private readonly string _basisUrl;

  /// <param name="http">Bij voorkeur uit IHttpClientFactory.</param>
  /// <param name="apiKey">Sleutel uit https://woz-api.nl/ApiKeys.</param>
  /// <param name="basisUrl">Alleen aanpassen voor een testomgeving.</param>
  public WozApiClient(HttpClient http, string apiKey, string basisUrl = StandaardBasisUrl)
  {
    _http = http ?? throw new ArgumentNullException(nameof(http));
    if (string.IsNullOrWhiteSpace(apiKey))
      throw new ArgumentException("apiKey is verplicht; maak er een aan op https://woz-api.nl/ApiKeys", nameof(apiKey));

    _apiKey = apiKey.Trim();
    _basisUrl = basisUrl.TrimEnd('/');
  }

  /// <summary>Zoekt op een vrij ingevoerd adres, bijvoorbeeld "Spuistraat 36C, 1012 TT Amsterdam".</summary>
  /// <param name="geometrie">Perceelgrenzen als GeoJSON meesturen. Standaard uit: dat maakt de respons fors groter.</param>
  public Task<JsonDocument> AdresAsync(string adres, bool geometrie = false, CancellationToken ct = default)
    => GetAsync("/Api/Adres", new Dictionary<string, string?>
    {
      ["adres"] = adres,
      ["geometrie"] = Bool(geometrie)
    }, ct);

  /// <summary>Zoekt op een BAG-nummeraanduiding-id.</summary>
  public Task<JsonDocument> NummeraanduidingAsync(string id, bool geometrie = false, CancellationToken ct = default)
    => GetAsync($"/Api/Nummeraanduiding/{Uri.EscapeDataString(id)}", new Dictionary<string, string?>
    {
      ["geometrie"] = Bool(geometrie)
    }, ct);

  /// <summary>Zoekt op een BAG-adresseerbaarobject-id.</summary>
  public Task<JsonDocument> AdresseerbaarObjectAsync(string id, bool geometrie = false, CancellationToken ct = default)
    => GetAsync($"/Api/AdresseerbaarObject/{Uri.EscapeDataString(id)}", new Dictionary<string, string?>
    {
      ["geometrie"] = Bool(geometrie)
    }, ct);

  /// <summary>Het resterende creditsaldo van deze sleutel.</summary>
  public Task<JsonDocument> CreditsAsync(CancellationToken ct = default)
    => GetAsync("/Api/Credits", new Dictionary<string, string?>(), ct);

  // Altijd invariant: "true"/"false" en niet een cultuurafhankelijke variant.
  private static string Bool(bool waarde) => waarde ? "true" : "false";

  private async Task<JsonDocument> GetAsync(string pad, Dictionary<string, string?> parameters, CancellationToken ct)
  {
    var query = string.Join("&", parameters
      .Where(p => !string.IsNullOrEmpty(p.Value))
      .Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value!)}"));

    var url = string.IsNullOrEmpty(query)
      ? $"{_basisUrl}{pad}"
      : $"{_basisUrl}{pad}?{query}";

    using var verzoek = new HttpRequestMessage(HttpMethod.Get, url);
    verzoek.Headers.Add("X-Api-Key", _apiKey);
    verzoek.Headers.Add("Accept", "application/json");
    verzoek.Headers.Add("User-Agent", $"wozapi-dotnet/{Versie}");

    using var antwoord = await _http.SendAsync(verzoek, ct).ConfigureAwait(false);
    var body = await antwoord.Content.ReadAsStringAsync(ct).ConfigureAwait(false);

    if (!antwoord.IsSuccessStatusCode)
    {
      throw new WozApiException((int)antwoord.StatusCode, Melding(body, antwoord.ReasonPhrase), body);
    }

    return JsonDocument.Parse(string.IsNullOrWhiteSpace(body) ? "null" : body);
  }

  /// <summary>Haalt de servermelding uit een JSON-foutbody; valt terug op de HTTP-reden.</summary>
  private static string Melding(string body, string? standaard)
  {
    if (!string.IsNullOrWhiteSpace(body))
    {
      try
      {
        using var doc = JsonDocument.Parse(body);
        foreach (var sleutel in new[] { "message", "error", "title", "detail" })
        {
          if (doc.RootElement.ValueKind == JsonValueKind.Object
              && doc.RootElement.TryGetProperty(sleutel, out var el)
              && el.ValueKind == JsonValueKind.String)
          {
            var waarde = el.GetString();
            if (!string.IsNullOrWhiteSpace(waarde)) return waarde!;
          }
        }
      }
      catch (JsonException)
      {
        // Geen JSON; dan is de HTTP-reden het beste dat we hebben.
      }
    }

    return standaard ?? "onbekende fout";
  }
}

/// <summary>Fout van de WOZ API, met de HTTP-status en waar mogelijk de servermelding.</summary>
public sealed class WozApiException : Exception
{
  public WozApiException(int status, string bericht, string? body = null)
    : base(string.Format(CultureInfo.InvariantCulture, "WozApi {0}: {1}", status, bericht))
  {
    Status = status;
    Bericht = bericht;
    Body = body;
  }

  public int Status { get; }
  public string Bericht { get; }
  public string? Body { get; }
}
