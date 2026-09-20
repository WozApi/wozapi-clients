# wozapi (Python)

Python-client voor de [WOZ API van woz-api.nl](https://woz-api.nl): de WOZ-waarde,
BAG-adresgegevens en kadastrale percelen van elk Nederlands adres in 1 JSON-response.
Geen externe afhankelijkheden, alleen de standaardbibliotheek.

## Installeren

```bash
pip install wozapi
```

Liever zonder dependency-manager? `wozapi.py` staat op zichzelf en kun je ook los in je
project kopieren.

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
