import { httpError } from './httpError.js';

const MODEL = process.env.CLAUDE_MODEL || 'anthropic/claude-sonnet-4.5';
const BASE_URL = process.env.AICREDITS_BASE_URL || 'https://aicredits.in/v1';

// Each section gets its own call so each stays well within aicredits.in's
// per-request token cap (~1500 total). All 5 run in parallel.
const SECTIONS = {
  soulPurpose:        'लग्न और नक्षत्र से आत्मा का उद्देश्य।',
  careerTiming:       'शनि की स्थिति से करियर का समय।',
  currentDasha:       'वर्तमान दशा का प्रभाव।',
  next24Months:       'अगले 24 महीनों की संभावनाएँ।',
  remediesAndUpgrades:'एक मंत्र या रत्न उपाय।',
};

// Compact chart data into a short string to minimise input tokens.
function compactChart(s) {
  const planets = (s.planets ?? [])
    .map(p => `${p.planet}(${p.house}H,${p.sign}${p.retrograde ? ',R' : ''})`)
    .join(' ');
  const d = s.dasha;
  const dasha = d ? `${d.mahadasha}MD-${d.antardasha}AD` : '';
  return `Lagna:${s.ascendant} Nakshatra:${s.nakshatra} ${dasha} | ${planets}`;
}

function parseJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

async function callSection(key, instruction, chartLine, birth, apiKey) {
  const prompt = `वैदिक ज्योतिषी: नीचे दी कुंडली से केवल "${key}" अनुभाग की हिंदी व्याख्या दें।
कुंडली: ${chartLine}
जन्म: DOB ${birth.dob}, ${birth.placeOfBirth}

${instruction}

केवल JSON लौटाएँ: {"teaser":"10 शब्द हिंदी में","content":"2 वाक्य हिंदी में"}`;

  const resp = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const raw = await resp.text();
  if (!resp.ok) {
    throw httpError(502, `Claude error on ${key} (${resp.status}): ${raw.slice(0, 150)}`);
  }

  const data = JSON.parse(raw);
  const finish = data.choices?.[0]?.finish_reason;
  const text = data.choices?.[0]?.message?.content ?? '';
  if (finish === 'length') {
    console.warn(`[claude] ${key} cut off at 300 tokens — response may be incomplete`);
  }
  try {
    return { key, value: parseJson(text) };
  } catch {
    console.warn(`[claude] ${key} parse failed, using fallback`);
    return { key, value: { teaser: 'व्याख्या उपलब्ध नहीं', content: 'कृपया पुनः प्रयास करें।' } };
  }
}

export async function generateInterpretation(chartSummary, birth) {
  const apiKey = process.env.AICREDITS_API_KEY;
  if (!apiKey) throw httpError(500, 'AICREDITS_API_KEY not configured.');

  const chartLine = compactChart(chartSummary);
  console.log('[claude] chart compact:', chartLine);

  // Run all 5 section calls in parallel.
  const results = await Promise.all(
    Object.entries(SECTIONS).map(([key, instruction]) =>
      callSection(key, instruction, chartLine, birth, apiKey)
    )
  );

  return Object.fromEntries(results.map(r => [r.key, r.value]));
}
