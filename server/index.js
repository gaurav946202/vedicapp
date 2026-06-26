import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DateTime } from 'luxon';

import { geocodePlace, getTimezone } from './lib/geocode.js';
import { getChart } from './lib/prokerala.js';
import { generateInterpretation } from './lib/claude.js';
import { TITLES } from './lib/mappings.js';
import { httpError } from './lib/httpError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// GET /api/claude-test — minimal call to aicredits.in to verify key + model work.
app.get('/api/claude-test', async (req, res) => {
  const apiKey = process.env.AICREDITS_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'anthropic/claude-sonnet-4.5';
  const baseUrl = process.env.AICREDITS_BASE_URL || 'https://aicredits.in/v1';
  try {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say OK' }],
      }),
    });
    const body = await resp.text();
    const headers = {};
    resp.headers.forEach((v, k) => { headers[k] = v; });
    res.json({ status: resp.status, model, headers, body: body.slice(0, 500) });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// GET /api/places?q= — Nominatim (OpenStreetMap) autocomplete proxy, India only.
// Proxied server-side so we can set the required User-Agent header.
app.get('/api/places', async (req, res) => {
  const q = (req.query.q ?? '').trim();
  if (q.length < 2) return res.json([]);
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('countrycodes', 'in');
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '7');
    url.searchParams.set('addressdetails', '1');
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'VedicApp/1.0 (astrology-chart-app)' },
    });
    const data = await resp.json();
    res.json(data.map(r => ({
      display: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    })));
  } catch {
    res.json([]);
  }
});

// POST /api/chart — takes birth details, returns chartData + Hindi interpretation
// in the exact shape the existing frontend components consume.
app.post('/api/chart', async (req, res, next) => {
  try {
    const { dob, timeOfBirth, approximateTime, placeOfBirth, lat: reqLat, lng: reqLng } = req.body ?? {};

    if (!dob || !placeOfBirth || (!timeOfBirth && !approximateTime)) {
      throw httpError(400, 'जन्म तिथि, समय और स्थान आवश्यक हैं।');
    }

    console.log(`[chart] request: ${placeOfBirth}, ${dob}`);

    // 1. Resolve coordinates + IANA timezone.
    //    If the frontend already resolved lat/lng (via Nominatim autocomplete),
    //    skip the geocode call and only fetch the timezone via reverse geocode.
    let lat, lng, timezone;
    if (reqLat != null && reqLng != null) {
      lat = reqLat;
      lng = reqLng;
      timezone = await getTimezone(lat, lng);
    } else {
      ({ lat, lng, timezone } = await geocodePlace(placeOfBirth));
    }

    // 2. Build an ISO-8601 datetime with the birthplace's historical UTC offset.
    const time = approximateTime ? '12:00' : timeOfBirth;
    const dt = DateTime.fromISO(`${dob}T${time}`, { zone: timezone });
    if (!dt.isValid) throw httpError(400, 'जन्म तिथि या समय अमान्य है।');
    const datetime = dt.toISO({ suppressMilliseconds: true });

    // 3. Prokerala: real chart math (planets, houses, lagna, nakshatra, dasha).
    const chart = await getChart({ datetime, lat, lng });

    console.log('[chart] Prokerala done, calling Claude...');
    // 4. Claude: Hindi interpretation from the computed chart (no recalculation).
    const interp = await generateInterpretation(chart.summary, {
      dob,
      timeOfBirth: time,
      approximateTime: Boolean(approximateTime),
      placeOfBirth,
    });

    // 5. Assemble into the shape ResultCardsGrid + BirthChartWheel already expect.
    const interpretations = {};
    for (const key of Object.keys(TITLES)) {
      interpretations[key] = { title: TITLES[key], ...interp[key] };
    }

    console.log('[chart] done, sending response');
    res.json({
      interpretations,
      chartData: chart.chartData,
      approximateTime: Boolean(approximateTime),
    });
  } catch (err) {
    next(err);
  }
});

// Serve the built frontend in production (single-origin deploy): build, then `npm start`.
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Error handler — surfaces the Hindi/English message with its status.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[api/chart]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'सर्वर त्रुटि' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Vedic chart API listening on http://localhost:${PORT}`);
});
