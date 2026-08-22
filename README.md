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
print(adres["wozWaarden"][0]["vastgesteldeWaarde"])
```

```javascript
import { WozApi } from 'wozapi';

const client = new WozApi('jouw-api-key');
const adres = await client.adres('Spuistraat 36C, 1012 TT Amsterdam');
console.log(adres.wozWaarden[0].vastgesteldeWaarde);
```

```csharp
var client = new WozApiClient(httpClient, "jouw-api-key");
using var adres = await client.AdresAsync("Spuistraat 36C, 1012 TT Amsterdam");
```

Een API-key maak je aan op [woz-api.nl](https://woz-api.nl). Een gratis account geeft
**10 credits**; 1 credit is 1 uniek adres, en hetzelfde adres binnen 7 dagen opnieuw opvragen
kost geen extra credit.

## Wat je terugkrijgt

- **WOZ-waarden** voor alle beschikbare peildata, dus ook de historie en niet alleen het
  laatste cijfer.
- **BAG-adresgegevens** uit de Basisregistratie Adressen en Gebouwen, inclusief bouwjaar en
  oppervlakte.
- **Kadastrale percelen** met oppervlakte, en perceelgrenzen als GeoJSON wanneer je daar om
  vraagt.

## Waarom niet rechtstreeks bij de bron?

Dat kan meestal niet, en dat is de reden dat deze API bestaat.

- De **WOZ API Bevragen** van het Kadaster (Haal Centraal) is er alleen voor gemeenten en
  vereist een OIN plus een PKIoverheid-certificaat.
- Het **WOZ-waardeloket** is een raadpleegsite zonder API, en staat massaal of geautomatiseerd
  onttrekken van gegevens niet toe.
- **WOZ+** van het Kadaster is een licentieproduct met een aansluittraject.

Meer achtergrond: [Heeft het WOZ-waardeloket een
API?](https://woz-api.nl/artikelen/woz-waardeloket-vs-lv-woz-vs-woz-drie-werelden-achter-een-woz-waarde)

## Documentatie en context

- API-referentie: [woz-api.nl/swagger](https://woz-api.nl/swagger/index.html)
- Prijzen per credit: [woz-api.nl/woz-api-prijs](https://woz-api.nl/woz-api-prijs)
- Zonder code werken: [WOZ-waarden in je Excel](https://woz-api.nl/woz-waarden-in-excel)
- Open cijfers: [WOZ-waarde per provincie en
  gemeente](https://woz-api.nl/woz-waarde-ontwikkeling), met downloadbare dataset
- English: [WOZ value API for Dutch properties](https://woz-api.nl/woz-value-api)

## Licentie

MIT
