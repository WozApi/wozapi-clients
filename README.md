<img src="assets/logo.png" alt="" width="76" align="right">

# WOZ API clients

Officiële clientlibraries voor de [WOZ API van woz-api.nl](https://woz-api.nl): de
**WOZ-waarde**, **BAG-adresgegevens** en **kadastrale percelen** van elk Nederlands adres in
1 JSON-response.

| Taal | Map | Pakketnaam |
|---|---|---|
| Python | [`python/`](python) | `wozapi` |
| Node.js en TypeScript | [`node/`](node) | `wozapi` |
| .NET | [`dotnet/`](dotnet) | `WozApi.Client` |

Alle drie zijn dun en **zonder externe afhankelijkheden**: alleen de standaardbibliotheek van
de taal.

## Snel starten

```python
from wozapi import WozApi

client = WozApi("jouw-api-key")
adres = client.adres("Spuistraat 36C, 1012 TT Amsterdam")
print(adres["woz"][0]["vastgesteldeWaarde"])
```

```javascript
import { WozApi } from 'wozapi';

const client = new WozApi('jouw-api-key');
const adres = await client.adres('Spuistraat 36C, 1012 TT Amsterdam');
console.log(adres.woz[0].vastgesteldeWaarde);
```

```csharp
var client = new WozApiClient(httpClient, "jouw-api-key");
using var adres = await client.AdresAsync("Spuistraat 36C, 1012 TT Amsterdam");
```

Een API-key maak je aan op [woz-api.nl](https://woz-api.nl). Een gratis account geeft
**10 credits**; 1 credit is 1 uniek adres, en hetzelfde adres binnen 7 dagen opnieuw opvragen
kost geen extra credit.

## Voor softwareleveranciers: OAuth-koppeling

Bouw je software waarin JOUW klanten WOZ-waarden zien? Naast de API-key is er een
OAuth-koppeling (authorization code met PKCE): elke klant koppelt een eigen WozApi-account en
betaalt eigen credits, jij stuurt het access token mee als `Authorization: Bearer`. Voor de
leverancier is de koppeling gratis. Technische referentie:
[wozapi.github.io/oauth.html](https://wozapi.github.io/oauth.html), productuitleg en aanvraag:
[woz-api.nl/woz-api-koppeling](https://woz-api.nl/woz-api-koppeling). Een accessToken-optie in
deze clients staat op de planning; tot die tijd zet je de header zelf.

## Wat je terugkrijgt

- **WOZ-waarden** voor alle beschikbare peildata, dus ook de historie en niet alleen het
  laatste cijfer.
- **BAG-adresgegevens** uit de Basisregistratie Adressen en Gebouwen: gestandaardiseerd adres
  met de nummeraanduiding- en adresseerbaarobject-identificatie.
- **Kadastrale percelen** met oppervlakte in m2, en perceelgrenzen als GeoJSON wanneer je daar
  om vraagt.
- **Grondoppervlakte** van het WOZ-object, indien bekend.

## Waarom niet rechtstreeks bij de bron?

Dat kan meestal niet, en dat is de reden dat deze API bestaat.

- De **landelijke voorziening WOZ** levert alleen aan afnemers die de wet aanwijst: gemeenten,
  waterschappen en de Belastingdienst; bestuursorganen met een wettelijke taak; en als derde
  groep verzekeraars, hypotheekverstrekkers en door NRVT gecertificeerde validatie-instituten.
  Hoor je daar niet bij, dan kun je geen aansluiting krijgen, ook niet betaald.
- Het **WOZ-waardeloket** is een raadpleegsite zonder API, en staat massaal of geautomatiseerd
  onttrekken van gegevens niet toe.
- **WOZ+** van het Kadaster is een licentieproduct met een aansluittraject.

Bronnen, gecontroleerd op 20 september 2026:
[artikel 37a Wet waardering onroerende zaken](https://wetten.overheid.nl/BWBR0007119/2024-01-01/0/HoofdstukVI/Artikel37a/)
voor de grondslag van de landelijke voorziening, en
[Kadaster, WOZ voor afnemers](https://www.kadaster.nl/zakelijk/registraties/landelijke-voorzieningen/woz/woz-voor-afnemers)
voor de afnemersindeling. Meer achtergrond: [Heeft het WOZ-waardeloket een
API?](https://woz-api.nl/artikelen/woz-waardeloket-vs-lv-woz-vs-woz-drie-werelden-achter-een-woz-waarde)

## Wat kost het

EUR 0,59 per credit bij 100 credits, aflopend tot EUR 0,35 bij 1.000 credits, excl. btw. Geen
abonnement en geen minimale afname, dus een maand zonder opvragingen kost niets. Reken je eigen
volume door voordat je een maandbundel elders vergelijkt: een bundel wordt goedkoper per adres
zodra je hem volmaakt, en duurder zodra je eronder blijft.

Ter context bij de cijfers die je terugkrijgt: de gemiddelde WOZ-waarde van een woning in
Nederland ging van EUR 250.000 in 2019 naar EUR 439.000 in 2026, een stijging van 75,6 procent.
Bron: [CBS StatLine tabel 85036NED](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/85036NED),
CC BY 4.0. De reeks per provincie en gemeente staat als
[downloadbare dataset](https://woz-api.nl/woz-waarde-ontwikkeling) op de hoofdsite.

## Documentatie en context

- Technische documentatie: [wozapi.github.io](https://wozapi.github.io/), met
  [aan de slag](https://wozapi.github.io/getting-started.html) en de volledige
  [veldreferentie](https://wozapi.github.io/reference.html)
- OpenAPI-definitie: [woz-api.nl/swagger](https://woz-api.nl/swagger/index.html)
- Prijzen per credit: [woz-api.nl/woz-api-prijs](https://woz-api.nl/woz-api-prijs)
- Zonder code werken: [WOZ-waarden in je Excel](https://woz-api.nl/woz-waarden-in-excel)
- Open cijfers: [WOZ-waarde per provincie en
  gemeente](https://woz-api.nl/woz-waarde-ontwikkeling), met downloadbare dataset
- English: [WOZ value API for Dutch properties](https://woz-api.nl/woz-value-api)

## Over WozApi

WozApi levert WOZ-, BAG- en kadastrale data via 1 endpoint, voor developers, proptech, fintech,
makelaardij, notariaat en datateams. Bekijk de [live demo](https://woz-api.nl) of lees de
[artikelen over WOZ-data](https://woz-api.nl/artikelen).

## Licentie

MIT
