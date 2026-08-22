/** Typedefinities voor de WozApi-client. De API levert Nederlandse veldnamen; die laten we
 *  ongewijzigd zodat de Swagger-documentatie een op een aansluit. */

export interface WozApiOpties {
  /** Alleen aanpassen voor een testomgeving. */
  basisUrl?: string;
  /** Afbreken na dit aantal milliseconden. Standaard 30000. */
  timeoutMs?: number;
}

export interface OpvraagOpties {
  /** Perceelgrenzen als GeoJSON meesturen. Standaard uit: het maakt de respons fors groter. */
  geometrie?: boolean;
}

export declare class WozApiError extends Error {
  readonly status: number;
  readonly bericht: string;
  readonly body?: string;
  constructor(status: number, bericht: string, body?: string);
}

export declare class WozApi {
  constructor(apiKey: string, opties?: WozApiOpties);

  /** Zoekt op een vrij ingevoerd adres, bijvoorbeeld "Spuistraat 36C, 1012 TT Amsterdam". */
  adres(adres: string, opties?: OpvraagOpties): Promise<Record<string, unknown>>;

  /** Zoekt op een BAG-nummeraanduiding-id. */
  nummeraanduiding(id: string, opties?: OpvraagOpties): Promise<Record<string, unknown>>;

  /** Zoekt op een BAG-adresseerbaarobject-id. */
  adresseerbaarObject(id: string, opties?: OpvraagOpties): Promise<Record<string, unknown>>;

  /** Het resterende creditsaldo van deze sleutel. */
  credits(): Promise<Record<string, unknown>>;
}

export default WozApi;
