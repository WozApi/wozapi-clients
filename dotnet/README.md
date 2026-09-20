# WozApi voor .NET

WOZ-waarde, BAG-adresgegevens en kadastrale percelen van elk Nederlands adres via 1 endpoint.
Dunne wrapper rond de [WOZ API van woz-api.nl](https://woz-api.nl), zonder afhankelijkheden
buiten de BCL.

```bash
dotnet add package WozApi.Client
```

Liever zonder pakketverwijzing? `WozApiClient.cs` staat op zichzelf en kun je ook los in je
project kopieren.

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

## Waarom niet rechtstreeks bij de bron?

De landelijke voorziening WOZ levert alleen aan afnemers die de wet aanwijst: gemeenten,
waterschappen en de Belastingdienst, bestuursorganen met een wettelijke taak, en als derde groep
verzekeraars, hypotheekverstrekkers en door NRVT gecertificeerde validatie-instituten. Voor de
WOZ API Bevragen van het Kadaster geldt daarbovenop dat een OIN en een PKIoverheid-certificaat
verplicht zijn. Hoor je daar niet bij, dan is er geen betaalde route naar een eigen aansluiting.
Het WOZ-waardeloket is een raadpleegsite zonder API en staat geautomatiseerd uitlezen niet toe.

Bronnen, gecontroleerd op 20 september 2026:
[artikel 37a Wet WOZ](https://wetten.overheid.nl/BWBR0007119/2024-01-01/0/HoofdstukVI/Artikel37a/),
[Kadaster WOZ voor afnemers](https://www.kadaster.nl/zakelijk/registraties/landelijke-voorzieningen/woz/woz-voor-afnemers)
en [WOZ API Bevragen](https://www.kadaster.nl/zakelijk/producten/adressen-en-gebouwen/woz-api-bevragen).

## Wat het kost

EUR 0,59 per credit bij 100 credits, aflopend tot EUR 0,35 bij 1.000 credits, excl. btw. Geen
abonnement en geen minimale afname, dus een maand zonder opvragingen kost niets. 1 credit is 1
uniek adres; hetzelfde adres binnen 7 dagen opnieuw opvragen kost geen extra credit. Een gratis
account geeft 10 credits. De staffel staat op [woz-api.nl/woz-api-prijs](https://woz-api.nl/woz-api-prijs).
