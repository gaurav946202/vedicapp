import { DateTime } from 'luxon';
import { geocodePlace, getTimezone } from '../server/lib/geocode.js';
import { getChart } from '../server/lib/prokerala.js';
import { generateInterpretation } from '../server/lib/claude.js';
import { TITLES } from '../server/lib/mappings.js';
import { httpError } from '../server/lib/httpError.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { dob, timeOfBirth, approximateTime, placeOfBirth, lat: reqLat, lng: reqLng } = req.body ?? {};

    if (!dob || !placeOfBirth || (!timeOfBirth && !approximateTime)) {
      throw httpError(400, 'जन्म तिथि, समय और स्थान आवश्यक हैं।');
    }

    let lat, lng, timezone;
    if (reqLat != null && reqLng != null) {
      lat = reqLat;
      lng = reqLng;
      timezone = await getTimezone(lat, lng);
    } else {
      ({ lat, lng, timezone } = await geocodePlace(placeOfBirth));
    }

    const time = approximateTime ? '12:00' : timeOfBirth;
    const dt = DateTime.fromISO(`${dob}T${time}`, { zone: timezone });
    if (!dt.isValid) throw httpError(400, 'जन्म तिथि या समय अमान्य है।');
    const datetime = dt.toISO({ suppressMilliseconds: true });

    const chart = await getChart({ datetime, lat, lng });

    const interp = await generateInterpretation(chart.summary, {
      dob,
      timeOfBirth: time,
      approximateTime: Boolean(approximateTime),
      placeOfBirth,
    });

    const interpretations = {};
    for (const key of Object.keys(TITLES)) {
      interpretations[key] = { title: TITLES[key], ...interp[key] };
    }

    res.json({
      interpretations,
      chartData: chart.chartData,
      approximateTime: Boolean(approximateTime),
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'सर्वर त्रुटि' });
  }
}
