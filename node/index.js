/**
 * WozApi: WOZ-waarde, BAG-adresgegevens en kadastrale percelen van elk Nederlands adres.
 *
 * Dunne wrapper rond https://woz-api.nl zonder externe afhankelijkheden: gebruikt de
 * ingebouwde fetch van Node 18 en hoger, zodat er geen dependency-discussie ontstaat.
 *
 * Snel starten:
 *
 *   import { WozApi } from 'wozapi';
 *
 *   const client = new WozApi('jouw-api-key');
 *   const adres = await client.adres('Spuistraat 36C, 1012 TT Amsterdam');
 *   console.log(adres.woz[0].vastgesteldeWaarde);
 *
 * Een gratis account op https://woz-api.nl geeft 10 credits. 1 credit is 1 uniek adres;
 * hetzelfde adres binnen 7 dagen opnieuw opvragen kost geen extra credit.
 */

const VERSIE = '1.0.0';
const STANDAARD_BASIS_URL = 'https://woz-api.nl';

/** Fout van de WOZ API, met de HTTP-status en waar mogelijk de servermelding. */
export class WozApiError extends Error {
  constructor(status, bericht, body) {
    super(`WozApi ${status}: ${bericht}`);
    this.name = 'WozApiError';
    this.status = status;
    this.bericht = bericht;
    this.body = body;
  }
}

export class WozApi {
  /**
   * @param {string} apiKey sleutel uit https://woz-api.nl/ApiKeys
   * @param {{ basisUrl?: string, timeoutMs?: number }} [opties]
   */
  constructor(apiKey, opties = {}) {
    if (!apiKey || !String(apiKey).trim()) {
      throw new Error('apiKey is verplicht; maak er een aan op https://woz-api.nl/ApiKeys');
    }
    this.apiKey = String(apiKey).trim();
    this.basisUrl = (opties.basisUrl || STANDAARD_BASIS_URL).replace(/\/+$/, '');
    this.timeoutMs = opties.timeoutMs ?? 30000;
  }

  /**
   * Zoekt op een vrij ingevoerd adres.
   * @param {string} adres bijvoorbeeld 'Spuistraat 36C, 1012 TT Amsterdam'
   * @param {{ geometrie?: boolean }} [opties] geometrie voegt perceelgrenzen als GeoJSON toe
   */
  adres(adres, opties = {}) {
    return this.#get('/Api/Adres', { adres, geometrie: opties.geometrie });
  }

  /** Zoekt op een BAG-nummeraanduiding-id. */
  nummeraanduiding(id, opties = {}) {
    return this.#get(`/Api/Nummeraanduiding/${encodeURIComponent(id)}`, { geometrie: opties.geometrie });
  }

  /** Zoekt op een BAG-adresseerbaarobject-id. */
  adresseerbaarObject(id, opties = {}) {
    return this.#get(`/Api/AdresseerbaarObject/${encodeURIComponent(id)}`, { geometrie: opties.geometrie });
  }

  /** Het resterende creditsaldo van deze sleutel. */
  credits() {
    return this.#get('/Api/Credits', {});
  }

  async #get(pad, parameters) {
    const query = new URLSearchParams();
    for (const [sleutel, waarde] of Object.entries(parameters)) {
      if (waarde === undefined || waarde === null) continue;
      query.set(sleutel, typeof waarde === 'boolean' ? String(waarde) : String(waarde));
    }

    const url = query.toString()
      ? `${this.basisUrl}${pad}?${query}`
      : `${this.basisUrl}${pad}`;

    // AbortController en niet de fetch-timeout-optie: die laatste bestaat niet overal.
    const stopper = new AbortController();
    const timer = setTimeout(() => stopper.abort(), this.timeoutMs);

    let antwoord;
    try {
      antwoord = await fetch(url, {
        headers: {
          'X-Api-Key': this.apiKey,
          Accept: 'application/json',
          'User-Agent': `wozapi-node/${VERSIE}`
        },
        signal: stopper.signal
      });
    } catch (fout) {
      clearTimeout(timer);
      if (fout.name === 'AbortError') {
        throw new WozApiError(0, `time-out na ${this.timeoutMs} ms`);
      }
      throw new WozApiError(0, `netwerkfout: ${fout.message}`);
    }
    clearTimeout(timer);

    const tekst = await antwoord.text();
    if (!antwoord.ok) {
      throw new WozApiError(antwoord.status, melding(tekst, antwoord.statusText), tekst);
    }

    return tekst ? JSON.parse(tekst) : null;
  }
}

/** Haalt de servermelding uit een JSON-foutbody; valt terug op de HTTP-statustekst. */
function melding(body, standaard) {
  try {
    const data = JSON.parse(body);
    for (const sleutel of ['message', 'error', 'title', 'detail']) {
      if (typeof data?.[sleutel] === 'string' && data[sleutel].trim()) return data[sleutel];
    }
  } catch {
    // geen JSON, dan is de statustekst het beste dat we hebben
  }
  return standaard;
}

export default WozApi;
