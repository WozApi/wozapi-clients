# Publiceren naar PyPI, NuGet en npm

Stand op 20 september 2026: **PyPI en NuGet zijn ingericht en het eerste pakket staat er.**
Alleen npm wacht nog op een token.

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
aangemaakt door `Harmenvdm` en wijst het pakket toe aan de organisatie `WozApi`. Zet je daar de
organisatie neer, dan antwoordt NuGet met:

```
Token exchange failed (HTTP 401). Make sure you are using the username of the policy
creator, not the policy owner: No matching trust policy owned by user 'WozApi' was found.
```

Het pakket komt nog steeds op naam van de organisatie; alleen het inwisselen van het token
gebeurt op naam van de maker.

### npm: nog een token nodig

npm is de enige die geen trusted publishing biedt voor dit pakket.

1. [npmjs.com](https://www.npmjs.com) → avatar → **Access Tokens**
2. **Generate New Token** → **Classic** → **Automation**. Automation is belangrijk: een
   Publish-token vraagt bij elk gebruik om 2FA en blokkeert dan in CI.
3. Zelf plaatsen, zodat de waarde nergens anders langskomt:

```
gh secret set NPM_TOKEN --repo WozApi/wozapi-clients
```

De workflow publiceert met `--provenance`, wat het pakket aantoonbaar aan deze repo en commit
koppelt. Dat werkt alleen omdat `repository` in `node/package.json` staat; zonder dat veld
weigert npm.

## Versie verhogen

Op vier plekken, en ze moeten gelijk blijven:

| Bestand | Veld |
|---|---|
| `node/package.json` | `version` |
| `python/pyproject.toml` | `version` onder `[project]` |
| `dotnet/WozApi.Client.csproj` | `<Version>` |
| `dotnet/WozApiClient.cs` | constante `Versie`, gaat mee in de User-Agent |

Die laatste wordt makkelijk vergeten. Loopt hij uit de pas, dan meldt de client een andere
versie dan er gepubliceerd is.
