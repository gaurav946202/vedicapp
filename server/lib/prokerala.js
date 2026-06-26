import { httpError } from './httpError.js';
import {
  signInfo,
  planetAbbr,
  nakshatraDisplay,
  formatDegree,
  houseFromSigns,
  findCurrentDasha,
} from './mappings.js';

const BASE_URL = 'https://api.prokerala.com/';

// Cached OAuth2 token (single server instance). Prokerala tokens last ~1 hour.
let cachedToken = null; // { value, expiresAt }

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw httpError(500, 'Prokerala credentials are not configured (PROKERALA_CLIENT_ID / PROKERALA_CLIENT_SECRET).');
  }

  const res = await fetch(new URL('token', BASE_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw httpError(502, `Prokerala authentication failed (${res.status}).`);

  const data = await res.json();
  // Refresh a minute early to avoid edge-of-expiry failures.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.value;
}

// GET https://api.prokerala.com/v2/astrology/<slug>?ayanamsa=&coordinates=&datetime=
// Returns the response's `data` object.
async function callEndpoint(slug, { ayanamsa, coordinates, datetime }) {
  const token = await getAccessToken();
  const url = new URL(`v2/astrology/${slug}`, BASE_URL);
  url.searchParams.set('ayanamsa', String(ayanamsa));
  url.searchParams.set('coordinates', coordinates);
  url.searchParams.set('datetime', datetime); // ISO-8601 with offset; URLSearchParams encodes the '+'

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw httpError(502, `Prokerala ${slug} failed (${res.status}). ${body}`.trim());
  }
  const json = await res.json();
  return json.data ?? json;
}

// Fetch and normalise everything the frontend needs from Prokerala.
// `datetime` must be ISO-8601 with the birthplace's UTC offset.
export async function getChart({ datetime, lat, lng }) {
  const ayanamsa = Number(process.env.PROKERALA_AYANAMSA ?? 1); // 1 = Lahiri (default Vedic)
  const coordinates = `${lat},${lng}`;
  const params = { ayanamsa, coordinates, datetime };

  const [planetData, birthData, dashaData] = await Promise.all([
    callEndpoint('planet-position', params),
    callEndpoint('birth-details', params),
    callEndpoint('dasha-periods', params),
  ]);

  // --- Planets + ascendant -------------------------------------------------
  const entries = planetData.planet_position ?? planetData.planets ?? [];

  // The ascendant (lagna) is returned as one of the position entries.
  const ascEntry = entries.find((e) => /ascendant|lagna/i.test(e.name || ''));
  const ascSign = ascEntry ? signInfo(ascEntry.rasi?.name) : null;
  if (!ascSign) {
    throw httpError(502, 'Could not determine ascendant from Prokerala planet-position response.');
  }

  const planets = []; // for the chart wheel: { name (Hindi abbr), house, degree }
  const planetSummary = []; // English, for Claude
  for (const e of entries) {
    const abbr = planetAbbr(e.name); // null for ascendant / non-grahas
    if (!abbr) continue;
    const sign = signInfo(e.rasi?.name);
    if (!sign) continue;
    const house = houseFromSigns(sign.num, ascSign.num);
    planets.push({
      name: abbr,
      house,
      degree: formatDegree(e.longitude ?? e.degree, sign.hi),
    });
    planetSummary.push({
      planet: e.name,
      sign: e.rasi?.name,
      house,
      retrograde: Boolean(e.is_retrograde),
    });
  }

  // --- Nakshatra + moon sign (from birth-details) --------------------------
  const nakshatraName = birthData.nakshatra?.name ?? '';
  const moonSign = signInfo(birthData.chandra_rasi?.name);

  return {
    chartData: {
      ascendant: `${ascSign.hi} (${ascEntry.rasi?.name})`,
      nakshatra: nakshatraDisplay(nakshatraName),
      rashi: moonSign ? `${moonSign.hi} (${birthData.chandra_rasi.name})` : '',
      planets,
    },
    // Compact, English summary handed to Claude for interpretation (never recalculated by the model).
    summary: {
      ascendant: ascEntry.rasi?.name,
      nakshatra: nakshatraName,
      moonSign: birthData.chandra_rasi?.name ?? null,
      sunSign: birthData.soorya_rasi?.name ?? null,
      planets: planetSummary,
      dasha: findCurrentDasha(dashaData.dasha_periods ?? dashaData.dasha ?? []),
    },
  };
}
