# wozapi (Python)

Python-client voor de [WOZ API van woz-api.nl](https://woz-api.nl): de WOZ-waarde,
BAG-adresgegevens en kadastrale percelen van elk Nederlands adres in 1 JSON-response.
Geen externe afhankelijkheden, alleen de standaardbibliotheek.

## Installeren

```bash
pip install wozapi
```

Nog niet gepubliceerd? Kopieer dan `wozapi.py` naar je project; het bestand staat op zichzelf.

## Gebruik

```python
from wozapi import WozApi, WozApiError

client = WozApi("jouw-api-key")

try:
    adres = client.adres("Spuistraat 36C, 1012 TT Amsterdam")
    for woz in adres["woz"]:
        print(woz["peildatum"], woz["vastgesteldeWaarde"])
except WozApiError as fout:
    print(fout.status, fout.bericht)
```

Perceelgrenzen als GeoJSON meesturen:

```python
adres = client.adres("Spuistraat 36C, 1012 TT Amsterdam", geometrie=True)
```

Zoeken op BAG-identificatie in plaats van een adrestekst:

```python
client.nummeraanduiding("0363200000218908")
client.adresseerbaar_object("0363010000740855")
```

Creditsaldo opvragen:

```python
print(client.credits())
```

## Wat kost het

Een gratis account geeft 10 credits. 1 credit is 1 uniek adres, en hetzelfde adres binnen
7 dagen opnieuw opvragen kost geen extra credit. De prijs per credit begint bij EUR 0,35
excl. btw en daalt bij grotere afname; zie [de prijzen](https://woz-api.nl/woz-api-prijs).

Geen zin in code? Met de [Excel-wizard](https://woz-api.nl/woz-waarden-in-excel) upload je een
bestand met adressen en krijg je het aangevuld terug.

## Documentatie

- API-referentie: [woz-api.nl/swagger](https://woz-api.nl/swagger/index.html)
- Uitleg en achtergrond: [woz-api.nl/artikelen](https://woz-api.nl/artikelen)
- Ontwikkeling van WOZ-waarden per regio: [woz-api.nl/woz-waarde-ontwikkeling](https://woz-api.nl/woz-waarde-ontwikkeling)

## Licentie

MIT
