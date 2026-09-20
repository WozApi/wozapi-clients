# Publiceren naar npm, PyPI en NuGet

Alles staat klaar. Wat nog ontbreekt is toegang tot de drie registries, en dat kan alleen iemand
met de accounts. Hieronder staat per registry wat je eenmalig doet; daarna is publiceren een knop.

Gecontroleerd op 20 september 2026: de pakketnamen `wozapi` (npm), `wozapi` (PyPI) en
`WozApi.Client` (NuGet) zijn alle drie nog vrij.

## Wat er al gebeurd is

- `python/pyproject.toml` en `dotnet/WozApi.Client.csproj` bestonden niet, dus die twee clients
  waren niet te publiceren. Ze zijn er nu en lokaal getest: `python -m build` plus `twine check`
  geven PASSED, `dotnet pack` levert een nupkg en een snupkg.
- `node/package.json` miste `repository`. Dat is geen cosmetiek: `npm publish --provenance`
  vergelijkt dat veld met de repo die de build draait en weigert zonder.
- `.github/workflows/publish.yml` publiceert alle drie, handmatig gestart.

## Eenmalig per registry

### PyPI: geen token nodig

PyPI ondersteunt trusted publishing, waarbij GitHub zich met OIDC legitimeert. Er komt dus geen
sleutel in de repo die kan lekken of verlopen.

1. Log in op [pypi.org](https://pypi.org) en ga naar **Your projects → Publishing**, of voor een
   nieuw project naar **Publishing → Add a new pending publisher**.
2. Vul in:
   - PyPI Project Name: `wozapi`
   - Owner: `WozApi`
   - Repository name: `wozapi-clients`
   - Workflow name: `publish.yml`
   - Environment name: `publiceren`

### npm: één token

1. Log in op [npmjs.com](https://www.npmjs.com) → **Access Tokens** → **Generate New Token** →
   type **Automation** (die werkt in CI en omzeilt 2FA-prompts).
2. Zet hem in deze repo onder **Settings → Secrets and variables → Actions** als `NPM_TOKEN`.

### NuGet: één token

1. Log in op [nuget.org](https://www.nuget.org) → **API Keys** → **Create**.
   - Key Name: `github-actions`
   - Scopes: **Push** met **Push new packages and package versions**
   - Glob Pattern: `WozApi.*`
2. Zet hem in deze repo als `NUGET_API_KEY`.

### De environment

De drie jobs draaien in de GitHub-environment `publiceren`. Maak die aan onder **Settings →
Environments**. Wil je een extra rem, zet er dan **Required reviewers** op: dan wacht elke
publicatie op jouw goedkeuring, ook als iemand anders de knop indrukt.

## Publiceren

**Actions → publiceer clients → Run workflow.** Kies welke registries, en typ `PUBLICEER` in het
bevestigingsveld. Zonder dat woord stopt de run meteen.

Er is bewust geen trigger op push of tag. Een versienummer is onherroepelijk: eenmaal gepubliceerd
kun je het niet hergebruiken, ook niet na intrekken. Een publicatie hoort een besluit te zijn, geen
bijwerking van een merge.

## Versie verhogen

Op drie plekken, en ze moeten gelijk blijven:

| Bestand | Veld |
|---|---|
| `node/package.json` | `version` |
| `python/pyproject.toml` | `version` onder `[project]` |
| `dotnet/WozApi.Client.csproj` | `<Version>` |

In `dotnet/WozApiClient.cs` staat daarnaast een constante `Versie` die in de User-Agent
meegaat. Die hoort dezelfde waarde te hebben, anders meldt de client een andere versie dan er
gepubliceerd is.
