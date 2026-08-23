# WozApi clientlibraries

Dunne, afhankelijkheidsvrije wrappers rond de WOZ API van [woz-api.nl](https://woz-api.nl):
WOZ-waarde, BAG-adresgegevens en kadastrale percelen van elk Nederlands adres via 1 endpoint.

| Taal | Map | Pakketnaam (gereserveerd) |
|---|---|---|
| Python | [`python/`](python) | `wozapi` |
| Node.js en TypeScript | [`node/`](node) | `wozapi` |
| .NET | [`dotnet/`](dotnet) | `WozApi.Client` |

## Waarom deze map bestaat

Twee redenen, in deze volgorde:

1. **Developers verwachten een client.** Wie een API beoordeelt, kijkt of er een library is.
   Een kopieerbaar codevoorbeeld in de eigen taal verlaagt de drempel tot de eerste geslaagde
   call meetbaar.
2. **Zichtbaarheid.** Op de zoekterm "woz api" staan `kadaster.github.io` en `github.com`
   allebei in de Google-top-10 met documentatie. Een publieke repository plus pakketpagina's
   op PyPI, npm en NuGet zijn extra vindplaatsen voor precies onze doelgroep, en leveren
   verwijzende domeinen op waar het domein er nu vrijwel geen heeft.

## Status

**Gepubliceerd op GitHub**: https://github.com/WozApi/wozapi-clients (publiek, MIT, topics
ingesteld, homepage naar woz-api.nl, commits op naam van WozApi en niet op een persoon). Staat
onder de organisatie WozApi, niet onder een persoonlijk account: dat leest als product en de
org-pagina is een extra merkentiteit. Deze map blijft de bron van waarheid; wijzig hier en push
daarna naar die repo.

### Nog niet gedaan: pakketregisters

Publiceren op PyPI, npm en NuGet vergt API-tokens die niet op deze machine staan (`npm whoami`
geeft ENEEDAUTH, `~/.pypirc` bestaat niet). Zie `docs/SEO_UITVOERINGSPLAN.md`, werkstroom C2.

## Gemeenschappelijke uitgangspunten

- Geen externe afhankelijkheden: alleen de standaardbibliotheek van de taal.
- Authenticatie via de header `X-Api-Key`. Bouw je als softwareleverancier de
  [OAuth-koppeling](https://wozapi.github.io/oauth.html) (klanten met een eigen
  WozApi-account), stuur dan het access token als `Authorization: Bearer` mee; een
  accessToken-optie in deze clients staat op de planning.
- Eén duidelijke foutsoort per taal, met de HTTP-status en de servermelding erin.
- Nederlandse veldnamen uit de API blijven ongewijzigd; vertalen zou alleen verwarring geven
  bij het lezen van de documentatie.
- Een gratis account geeft 10 credits. 1 credit is 1 uniek adres; hetzelfde adres binnen
  7 dagen opnieuw opvragen is gratis.
