// English -> Hindi mappings + chart helpers.
// Prokerala is called in English (1x credits), so all Hindi rendering happens here,
// matching the labels the existing frontend components already display.

// Zodiac signs: English OR Sanskrit name -> { num (1-12, Aries=1), hi }
// Prokerala returns Sanskrit names (Karka, Vrishabha, …) so both sets are needed.
const SIGNS = {
  // Western English
  aries: { num: 1, hi: 'मेष' },
  taurus: { num: 2, hi: 'वृषभ' },
  gemini: { num: 3, hi: 'मिथुन' },
  cancer: { num: 4, hi: 'कर्क' },
  leo: { num: 5, hi: 'सिंह' },
  virgo: { num: 6, hi: 'कन्या' },
  libra: { num: 7, hi: 'तुला' },
  scorpio: { num: 8, hi: 'वृश्चिक' },
  sagittarius: { num: 9, hi: 'धनु' },
  capricorn: { num: 10, hi: 'मकर' },
  aquarius: { num: 11, hi: 'कुंभ' },
  pisces: { num: 12, hi: 'मीन' },
  // Sanskrit / Vedic (Prokerala's actual response values)
  mesha: { num: 1, hi: 'मेष' },
  vrishabha: { num: 2, hi: 'वृषभ' },
  mithuna: { num: 3, hi: 'मिथुन' },
  karka: { num: 4, hi: 'कर्क' },
  simha: { num: 5, hi: 'सिंह' },
  kanya: { num: 6, hi: 'कन्या' },
  tula: { num: 7, hi: 'तुला' },
  vrischika: { num: 8, hi: 'वृश्चिक' },
  vrishchika: { num: 8, hi: 'वृश्चिक' },
  dhanu: { num: 9, hi: 'धनु' },
  makara: { num: 10, hi: 'मकर' },
  kumbha: { num: 11, hi: 'कुंभ' },
  meena: { num: 12, hi: 'मीन' },
};

// Planet -> Hindi abbreviation used by BirthChartWheel's legend (सू, चं, मं, ...).
// Keyed by both English and common Vedic names so either Prokerala spelling matches.
const PLANET_ABBR = {
  sun: 'सू', surya: 'सू',
  moon: 'चं', chandra: 'चं',
  mars: 'मं', mangal: 'मं', mangala: 'मं',
  mercury: 'बु', budha: 'बु',
  jupiter: 'गु', guru: 'गु', brihaspati: 'गु',
  venus: 'शु', shukra: 'शु',
  saturn: 'श', shani: 'श',
  rahu: 'रा',
  ketu: 'के',
};

// 27 nakshatras: English -> Hindi (for nicer chart-meta display; falls back to English).
const NAKSHATRA_HI = {
  ashwini: 'अश्विनी', bharani: 'भरणी', krittika: 'कृत्तिका', rohini: 'रोहिणी',
  mrigashira: 'मृगशिरा', mrigashirsha: 'मृगशिरा', ardra: 'आर्द्रा', punarvasu: 'पुनर्वसु',
  pushya: 'पुष्य', ashlesha: 'आश्लेषा', magha: 'मघा',
  'purva phalguni': 'पूर्वा फाल्गुनी', 'uttara phalguni': 'उत्तरा फाल्गुनी',
  hasta: 'हस्त', chitra: 'चित्रा', swati: 'स्वाति', vishakha: 'विशाखा',
  anuradha: 'अनुराधा', jyeshtha: 'ज्येष्ठा', mula: 'मूल', moola: 'मूल',
  'purva ashadha': 'पूर्वाषाढ़ा', 'uttara ashadha': 'उत्तराषाढ़ा',
  shravana: 'श्रवण', dhanishta: 'धनिष्ठा', shatabhisha: 'शतभिषा',
  'purva bhadrapada': 'पूर्वाभाद्रपद', 'uttara bhadrapada': 'उत्तराभाद्रपद', revati: 'रेवती',
};

// Fixed card titles — taken verbatim from the existing mock so the cards render identically.
export const TITLES = {
  soulPurpose: 'आत्मा का उद्देश्य (Soul Purpose)',
  careerTiming: 'करियर का समय (Career Timing)',
  currentDasha: 'वर्तमान दशा (Current planetary period)',
  next24Months: 'आगामी 24 महीने (24-Month Outlook)',
  remediesAndUpgrades: 'उपाय (Remedies & Upgrades)',
};

const norm = (s) => String(s || '').trim().toLowerCase();

// Look up a sign by its English name; returns { num, hi } or null.
export function signInfo(name) {
  return SIGNS[norm(name)] || null;
}

// Map a planet name (English or Vedic) to its Hindi abbreviation, or null if not one
// of the nine grahas shown on the chart (filters out Ascendant, outer planets, etc.).
export function planetAbbr(name) {
  return PLANET_ABBR[norm(name)] || null;
}

// "Purva Phalguni" -> "पूर्वा फाल्गुनी (Purva Phalguni)"; falls back to the English name.
export function nakshatraDisplay(name) {
  if (!name) return '';
  const hi = NAKSHATRA_HI[norm(name)];
  return hi ? `${hi} (${name})` : name;
}

// Format an ecliptic longitude into a chart-style degree string within its sign,
// e.g. (124.2, "सिंह") -> "सिंह 04° 12'". Accepts absolute longitude or within-sign degree.
export function formatDegree(longitude, signHi) {
  const within = (((Number(longitude) || 0) % 30) + 30) % 30;
  const d = Math.floor(within);
  const m = Math.floor((within - d) * 60);
  const dm = `${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}'`;
  return signHi ? `${signHi} ${dm}` : dm;
}

// Whole-sign house placement (North Indian convention): the house a planet's sign
// occupies counting from the ascendant's sign. Both args are 1-12 sign numbers.
export function houseFromSigns(planetSignNum, ascendantSignNum) {
  return (((planetSignNum - ascendantSignNum) % 12) + 12) % 12 + 1;
}

// Given Prokerala's dasha period tree, return the currently-active maha/antardasha.
// Defensive about the exact array key/field names across API revisions.
export function findCurrentDasha(periods) {
  const list = Array.isArray(periods) ? periods : [];
  const now = Date.now();
  const inRange = (p) => {
    const s = Date.parse(p.start ?? p.start_date ?? '');
    const e = Date.parse(p.end ?? p.end_date ?? '');
    return Number.isFinite(s) && Number.isFinite(e) && now >= s && now <= e;
  };
  const maha = list.find(inRange) || list[0];
  if (!maha) return null;
  const antars = maha.antardasha ?? maha.antardashas ?? maha.bhukti ?? [];
  const antar = antars.find(inRange) || antars[0] || null;
  return {
    mahadasha: maha.name ?? maha.planet ?? null,
    antardasha: antar?.name ?? antar?.planet ?? null,
    startDate: maha.start ?? maha.start_date ?? null,
    endDate: maha.end ?? maha.end_date ?? null,
  };
}
