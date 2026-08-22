"""
WozApi: WOZ-waarde, BAG-adresgegevens en kadastrale percelen van elk Nederlands adres.

Dunne wrapper rond https://woz-api.nl zonder externe afhankelijkheden: alleen de
standaardbibliotheek, zodat deze client in elke omgeving werkt zonder dependency-discussie.

Snel starten:

    from wozapi import WozApi

    client = WozApi("jouw-api-key")
    adres = client.adres("Spuistraat 36C, 1012 TT Amsterdam")
    print(adres["wozWaarden"][0]["vastgesteldeWaarde"])

Een gratis account op https://woz-api.nl geeft 10 credits. 1 credit is 1 uniek adres;
hetzelfde adres binnen 7 dagen opnieuw opvragen kost geen extra credit.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

__version__ = "1.0.0"
__all__ = ["WozApi", "WozApiError"]

STANDAARD_BASIS_URL = "https://woz-api.nl"


class WozApiError(RuntimeError):
    """Fout van de WOZ API. Bevat de HTTP-status en, indien aanwezig, de servermelding."""

    def __init__(self, status: int, bericht: str, body: str | None = None) -> None:
        super().__init__(f"WozApi {status}: {bericht}")
        self.status = status
        self.bericht = bericht
        self.body = body


class WozApi:
    """Client voor de WOZ API.

    Args:
        api_key: je sleutel uit https://woz-api.nl/ApiKeys.
        basis_url: alleen aanpassen voor een testomgeving.
        timeout: seconden voordat een request afbreekt.
    """

    def __init__(
        self,
        api_key: str,
        basis_url: str = STANDAARD_BASIS_URL,
        timeout: float = 30.0,
    ) -> None:
        if not api_key or not api_key.strip():
            raise ValueError("api_key is verplicht; maak er een aan op https://woz-api.nl/ApiKeys")
        self._api_key = api_key.strip()
        self._basis_url = basis_url.rstrip("/")
        self._timeout = timeout

    def adres(self, adres: str, geometrie: bool = False) -> dict[str, Any]:
        """Zoekt op een vrij ingevoerd adres, bijvoorbeeld "Spuistraat 36C, 1012 TT Amsterdam".

        Args:
            adres: het adres als tekst.
            geometrie: ook perceelgrenzen als GeoJSON meesturen. Standaard uit, want dat
                maakt de respons fors groter.
        """
        return self._get("/Api/Adres", {"adres": adres, "geometrie": geometrie})

    def nummeraanduiding(self, nummeraanduiding_id: str, geometrie: bool = False) -> dict[str, Any]:
        """Zoekt op een BAG-nummeraanduiding-id."""
        pad = f"/Api/Nummeraanduiding/{urllib.parse.quote(str(nummeraanduiding_id))}"
        return self._get(pad, {"geometrie": geometrie})

    def adresseerbaar_object(self, object_id: str, geometrie: bool = False) -> dict[str, Any]:
        """Zoekt op een BAG-adresseerbaarobject-id (verblijfsobject, ligplaats, standplaats)."""
        pad = f"/Api/AdresseerbaarObject/{urllib.parse.quote(str(object_id))}"
        return self._get(pad, {"geometrie": geometrie})

    def credits(self) -> dict[str, Any]:
        """Het resterende creditsaldo van deze sleutel."""
        return self._get("/Api/Credits", {})

    def _get(self, pad: str, parameters: dict[str, Any]) -> dict[str, Any]:
        schoon = {
            sleutel: ("true" if waarde is True else "false" if waarde is False else str(waarde))
            for sleutel, waarde in parameters.items()
            if waarde is not None
        }
        url = f"{self._basis_url}{pad}"
        if schoon:
            url = f"{url}?{urllib.parse.urlencode(schoon)}"

        verzoek = urllib.request.Request(
            url,
            headers={
                "X-Api-Key": self._api_key,
                "Accept": "application/json",
                "User-Agent": f"wozapi-python/{__version__}",
            },
        )

        try:
            with urllib.request.urlopen(verzoek, timeout=self._timeout) as antwoord:
                return json.loads(antwoord.read().decode("utf-8"))
        except urllib.error.HTTPError as fout:
            body = fout.read().decode("utf-8", errors="replace")
            raise WozApiError(fout.code, _melding(body, fout.reason), body) from fout
        except urllib.error.URLError as fout:
            raise WozApiError(0, f"netwerkfout: {fout.reason}") from fout


def _melding(body: str, standaard: str) -> str:
    """Haalt de servermelding uit een JSON-foutbody; valt terug op de HTTP-reden."""
    try:
        data = json.loads(body)
    except (ValueError, TypeError):
        return standaard
    if isinstance(data, dict):
        for sleutel in ("message", "error", "title", "detail"):
            waarde = data.get(sleutel)
            if isinstance(waarde, str) and waarde.strip():
                return waarde
    return standaard
