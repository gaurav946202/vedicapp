import { httpError } from './httpError.js';

async function openCageRequest(q) {
  const key = process.env.GEOCODING_API_KEY;
  if (!key) throw httpError(500, 'GEOCODING_API_KEY is not configured on the server.');
  const url = new URL('https://api.opencagedata.com/geocode/v1/json');
  url.searchParams.set('q', q);
  url.searchParams.set('key', key);
  url.searchParams.set('limit', '1');
  url.searchParams.set('no_annotations', '0');
  const res = await fetch(url);
  if (!res.ok) throw httpError(502, `Geocoding service error (${res.status}).`);
  return res.json();
}

// Resolve a free-text place name to { lat, lng, timezone } via OpenCage.
export async function geocodePlace(place) {
  const data = await openCageRequest(place);
  const result = data.results?.[0];
  if (!result) throw httpError(400, `जन्म स्थान नहीं मिला: "${place}"। कृपया स्थान दोबारा जाँचें।`);
  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    timezone: result.annotations?.timezone?.name || 'UTC',
  };
}

// When lat/lng are already known (from Nominatim autocomplete), call OpenCage
// reverse-geocode just to get the IANA timezone for the birth datetime offset.
export async function getTimezone(lat, lng) {
  const data = await openCageRequest(`${lat}+${lng}`);
  const tz = data.results?.[0]?.annotations?.timezone?.name;
  if (!tz) throw httpError(502, 'Could not determine timezone for the selected location.');
  return tz;
}
