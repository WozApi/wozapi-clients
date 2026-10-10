# Publiceren naar PyPI, NuGet en npm

Stand op 10 oktober 2026: **PyPI, NuGet en npm zijn ingericht.** Het npm-pakket is opnieuw
opgezet onder het account `woz-api` (zie npm hieronder).

## Publiceren

**Actions → publiceer clients → Run workflow.** Kies de registries en typ `PUBLICEER` in het
bevestigingsveld. Zonder dat woord stopt de run meteen.

Er is bewust geen trigger op push of tag. Een versienummer is onherroepelijk: eenmaal
gepubliceerd kun je het niet hergebruiken, ook niet na intrekken. Een publicatie hoort een
besluit te zijn, geen bijwerking van een merge.

## Hoe het is ingericht

### PyPI: klaar, zonder token

Trusted publishing via OIDC. Op pypi.org staat een pending publisher voor project `wozapi`,
gekoppeld aan owner `WozApi`, repository `wozapi-clients`, workflow `publish.yml`, environment
`publiceren`. Er staat geen sleutel in deze repo.

### NuGet: klaar, zonder token

Ook trusted publishing. De policy staat op nuget.org onder **Trusted Publishing**, met:

| Veld | Waarde |
|---|---|
| Package Owner | `WozApi` (de organisatie) |
| Repository Owner | `WozApi` |
| Repository | `wozapi-clients` |
| Workflow File | `publish.yml` |
| Environment | `publiceren` |
| Glob Patterns | `WozApi.*` |

**De valkuil die ons een mislukte run kostte:** het veld `user:` in de `NuGet/login`-stap is de
**maker** van de policy, niet de eigenaar van het pakket. Die twee verschillen hier: de policy is
aangemaakt door een persoonlijk NuGet-account (geheim `NUGET_USER`) en wijst het pakket toe aan de organisatie `WozApi`. Zet je daar de
organisatie neer, dan antwoordt NuGet met:

```
Token exchange failed (HTTP 401). Make sure you are using the username of the policy
creator, not the policy owner: No matching trust policy owned by user 'WozApi' was found.
```

Het pakket komt nog steeds op naam van de organisatie; alleen het inwisselen van het token
gebeurt op naam van de maker.

### npm: een token van het account wozapi

Het pakket `wozapi` staat sinds oktober 2026 op het npm-account `woz-api` (info@woz-api.nl; de naam `wozapi` is op npm een organisatie), met
dat account als enige eigenaar. De workflow publiceert met het token in het geheim
`NPM_TOKEN_WOZAPI` (omgeving `publiceren`): een granular access token van dat account met lees- en
schrijfrecht op het pakket. Let op de vervaldatum die npm op zo'n token zet; verloopt hij, maak
dan een nieuwe en zet hem met:

```
gh secret set NPM_TOKEN_WOZAPI --repo WozApi/wozapi-clients --env publiceren
```

De workflow publiceert met `--provenance`, wat het pakket aantoonbaar aan deze repo en commit
koppelt. Dat werkt alleen omdat `repository` in `node/package.json` staat; zonder dat veld
weigert npm.

In oktober 2026 is het pakket onder het vorige account in zijn geheel verwijderd en daarna
opnieuw gepubliceerd vanaf `woz-api`, met 1.0.3 als eerste versie. 1.0.1 en 1.0.2 zijn daarmee
verbruikt. Eigenaren overdragen met een token kan sinds augustus 2026 niet meer: npm vraagt
daarvoor de tweede factor, interactief op de site.

**Tokens die de tweede factor overslaan publiceren vanaf ongeveer januari 2027 niet meer direct**
(github.blog/changelog, 8 juli 2026). Zet daarvoor trusted publishing aan, zoals hieronder.

Het token kan weg met trusted publishing: npmjs.com, pakket `wozapi`, Settings, Trusted
Publisher, GitHub Actions, met organization `WozApi`, repository `wozapi-clients`, workflow
`publish.yml`, environment `publiceren` en **Allow npm publish** aangevinkt. Daarvoor vraagt npm
de tweede factor van het account `woz-api`. Daarna `gh secret delete NPM_TOKEN_WOZAPI --repo
WozApi/wozapi-clients --env publiceren`.

PyPI en NuGet hebben geen sleutel nodig; daar loopt alles al via OIDC.

## Versie verhogen

Op vijf plekken, en ze moeten gelijk blijven (npm loopt sinds de overdracht een versie voor:
1.0.3 naast 1.0.2 bij PyPI en NuGet; de volgende gezamenlijke versie is 1.0.4):

| Bestand | Veld |
|---|---|
| `node/package.json` | `version` |
| `python/pyproject.toml` | `version` onder `[project]` |
| `dotnet/WozApi.Client.csproj` | `<Version>` |
| `dotnet/WozApiClient.cs` | constante `Versie`, gaat mee in de User-Agent |
| `node/index.js` | constante `VERSIE`, gaat mee in de User-Agent |

De twee constanten worden makkelijk vergeten. Loopt er een uit de pas, dan meldt de client een andere
versie dan er gepubliceerd is.
