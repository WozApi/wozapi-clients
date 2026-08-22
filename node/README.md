# wozapi (Node.js en TypeScript)

Client voor de [WOZ API van woz-api.nl](https://woz-api.nl): de WOZ-waarde, BAG-adresgegevens
en kadastrale percelen van elk Nederlands adres in 1 JSON-response. Geen afhankelijkheden,
gebruikt de ingebouwde fetch van Node 18 en hoger. Typedefinities meegeleverd.

## Installeren

```bash
npm install wozapi
```

## Gebruik

```javascript
import { WozApi, WozApiError } from 'wozapi';

const client = new WozApi('jouw-api-key');

try {
  const adres = await client.adres('Spuistraat 36C, 1012 TT Amsterdam');
  for (const woz of adres.wozWaarden) {
    console.log(woz.peildatum, woz.vastgesteldeWaarde);
  }
} catch (fout) {
  if (fout instanceof WozApiError) console.error(fout.status, fout.bericht);
  else throw fout;
}
```

Perceelgrenzen als GeoJSON meesturen:

```javascript
const adres = await client.adres('Spuistraat 36C, 1012 TT Amsterdam', { geometrie: true });
```

Zoeken op BAG-identificatie:

```javascript
await client.nummeraanduiding('0363200000218908');
await client.adresseerbaarObject('0363010000740855');
```

Creditsaldo opvragen:

```javascript
console.log(await client.credits());
```

## Wat kost het

Een gratis account geeft 10 credits. 1 credit is 1 uniek adres, en hetzelfde adres binnen
7 dagen opnieuw opvragen kost geen extra credit. De prijs per credit begint bij EUR 0,35
excl. btw; zie [de prijzen](https://woz-api.nl/woz-api-prijs).

## Documentatie

- API-referentie: [woz-api.nl/swagger](https://woz-api.nl/swagger/index.html)
- Uitleg en achtergrond: [woz-api.nl/artikelen](https://woz-api.nl/artikelen)
- WOZ-waarden per regio: [woz-api.nl/woz-waarde-ontwikkeling](https://woz-api.nl/woz-waarde-ontwikkeling)

## Licentie

MIT
