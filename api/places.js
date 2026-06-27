export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { searchParams } = new URL(req.url, 'http://localhost');
  const q = (searchParams.get('q') ?? '').trim();
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
}
