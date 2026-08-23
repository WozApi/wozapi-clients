# WozApi voor .NET

WOZ-waarde, BAG-adresgegevens en kadastrale percelen van elk Nederlands adres via 1 endpoint.
Dunne wrapper rond de [WOZ API van woz-api.nl](https://woz-api.nl), zonder afhankelijkheden
buiten de BCL.

Pakketnaam (gereserveerd): `WozApi.Client`. Zolang die nog niet op NuGet staat, kopieer je
`WozApiClient.cs` in je project.

## Gebruik

De client neemt bewust een `HttpClient` mee in plaats van er zelf een te maken: een eigen
`HttpClient` per instantie is de klassieke bron van socket-uitputting in langlopende processen.
Gebruik in ASP.NET dus `IHttpClientFactory`.

```csharp
using WozApi.Client;

var client = new WozApiClient(httpClient, "jouw-api-key");

try
{
    using var adres = await client.AdresAsync("Spuistraat 36C, 1012 TT Amsterdam");
    foreach (var woz in adres.RootElement.GetProperty("woz").EnumerateArray())
    {
        Console.WriteLine($"{woz.GetProperty("peildatum").GetString()}: " +
                          $"{woz.GetProperty("vastgesteldeWaarde").GetInt32()}");
    }
}
catch (WozApiException fout)
{
    Console.Error.WriteLine($"{fout.Status}: {fout.Bericht}");
}
```

Registratie via `IHttpClientFactory`:

```csharp
builder.Services.AddHttpClient<WozApiClient>()
    .AddTypedClient((http, sp) => new WozApiClient(http, builder.Configuration["WozApi:ApiKey"]!));
```

Perceelgrenzen als GeoJSON meesturen:

```csharp
using var adres = await client.AdresAsync("Spuistraat 36C, 1012 TT Amsterdam", geometrie: true);
```

## Methoden

| Methode | Endpoint |
|---|---|
| `AdresAsync(adres, geometrie)` | `GET /Api/Adres` |
| `NummeraanduidingAsync(id, geometrie)` | `GET /Api/Nummeraanduiding/{id}` |
| `AdresseerbaarObjectAsync(id, geometrie)` | `GET /Api/AdresseerbaarObject/{id}` |
| `CreditsAsync()` | `GET /Api/Credits` |

Alle methoden geven een `JsonDocument` terug, die je zelf disposet (`using`). De client typeert
de respons bewust niet: de Nederlandse veldnamen uit de API blijven zo zichtbaar en je hoeft
niet mee te migreren als er een veld bijkomt.

## Fouten

Een niet-2xx-respons geeft een `WozApiException` met `Status`, `Bericht` en de ruwe `Body`.
Het bericht komt uit de servermelding (`fout`, `detail`, `message` of `title`) en valt terug op
de HTTP-reden als de body geen JSON is.

## Credits

Een gratis account op [woz-api.nl](https://woz-api.nl) geeft 10 credits. 1 credit is 1 uniek
adres; hetzelfde adres binnen 7 dagen opnieuw opvragen kost geen extra credit. Het resterende
saldo staat in de responseheader `X-Credits-Remaining` en is ook op te vragen met
`CreditsAsync()`.

## Licentie

MIT.
