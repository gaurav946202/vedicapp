// Map of Hindi/English sign names to their traditional Vedic number (1-12)
const SIGN_MAP = {
  "मेष": 1, "Aries": 1, "mesh": 1, "mesha": 1,
  "वृषभ": 2, "Taurus": 2, "vrishabh": 2, "vrishabha": 2,
  "मिथुन": 3, "Gemini": 3, "mithun": 3, "mithuna": 3,
  "कर्क": 4, "Cancer": 4, "kark": 4, "karka": 4,
  "सिंह": 5, "Leo": 5, "singh": 5, "simha": 5,
  "कन्या": 6, "Virgo": 6, "kanya": 6,
  "तुला": 7, "Libra": 7, "tula": 7,
  "वृश्चिक": 8, "Scorpio": 8, "vrishchik": 8, "vrishchika": 8,
  "धनु": 9, "Sagittarius": 9, "dhanu": 9, "dhanus": 9,
  "मकर": 10, "Capricorn": 10, "makar": 10, "makara": 10,
  "कुंभ": 11, "Aquarius": 11, "kumbh": 11, "kumbha": 11,
  "मीन": 12, "Pisces": 12, "meen": 12, "meena": 12
};

const HOUSE_POLYGONS = {
  1: "200,200 101,101 200,2 299,101",
  2: "2,2 200,2 101,101",
  3: "2,2 2,200 101,101",
  4: "200,200 101,101 2,200 101,299",
  5: "2,398 2,200 101,299",
  6: "2,398 200,398 101,299",
  7: "200,200 101,299 200,398 299,299",
  8: "398,398 200,398 299,299",
  9: "398,398 398,200 299,299",
  10: "200,200 299,101 398,200 299,299",
  11: "398,2 398,200 299,101",
  12: "398,2 200,2 299,101"
};

export default function BirthChartWheel({ chartData }) {
  if (!chartData) return null;

  const { ascendant, nakshatra, rashi, planets } = chartData;

  // Extract starting sign number for the 1st House (Lagna)
  let startSignNum = 1;
  const normalizedAsc = ascendant ? ascendant.toLowerCase() : "";
  for (const [key, val] of Object.entries(SIGN_MAP)) {
    if (normalizedAsc.includes(key.toLowerCase())) {
      startSignNum = val;
      break;
    }
  }

  // Helper to get sign number for any house (1-indexed house 1 to 12)
  const getSignForHouse = (houseNum) => {
    return ((startSignNum - 1 + (houseNum - 1)) % 12) + 1;
  };

  // Group planets by house for rendering
  const planetsByHouse = Array.from({ length: 13 }, () => []);
  if (planets && Array.isArray(planets)) {
    planets.forEach(p => {
      if (p.house >= 1 && p.house <= 12) {
        planetsByHouse[p.house].push(p);
      }
    });
  }

  // Positioning config for houses in the 400x400 SVG
  // Contains centroid/label positions for house numbers and planet listings
  const houseLayout = {
    1: {
      signX: 200, signY: 135,
      planetsX: 200, planetsY: 90
    },
    2: {
      signX: 115, signY: 35,
      planetsX: 100, planetsY: 60
    },
    3: {
      signX: 35, signY: 115,
      planetsX: 60, planetsY: 100
    },
    4: {
      signX: 135, signY: 200,
      planetsX: 90, planetsY: 200
    },
    5: {
      signX: 35, signY: 285,
      planetsX: 60, planetsY: 300
    },
    6: {
      signX: 115, signY: 365,
      planetsX: 100, planetsY: 340
    },
    7: {
      signX: 200, signY: 265,
      planetsX: 200, planetsY: 310
    },
    8: {
      signX: 285, signY: 365,
      planetsX: 300, planetsY: 340
    },
    9: {
      signX: 365, signY: 285,
      planetsX: 340, planetsY: 300
    },
    10: {
      signX: 265, signY: 200,
      planetsX: 310, planetsY: 200
    },
    11: {
      signX: 365, signY: 115,
      planetsX: 340, planetsY: 100
    },
    12: {
      signX: 285, signY: 35,
      planetsX: 300, planetsY: 60
    }
  };

  return (
    <div className="chart-section glass-card reveal">
      <div className="chart-header">
        <h3 className="chart-title">आपकी जन्म कुंडली (North Indian Chart)</h3>
      </div>

      <div className="chart-svg-container">
        <svg viewBox="0 0 400 400" className="chart-svg" width="100%" height="100%">
          {/* Defs for gradients/glows */}
          <defs>
            <linearGradient id="chart-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-cyan)" />
              <stop offset="50%" stopColor="var(--bg-nebula-2)" />
              <stop offset="100%" stopColor="var(--accent-gold)" />
            </linearGradient>
            <filter id="glow-light" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render background polygons for each house first (so they sit behind grid lines) */}
          {Object.entries(houseLayout).map(([houseStr]) => {
            const houseNum = parseInt(houseStr);
            const housePlanets = planetsByHouse[houseNum];
            const hasPlanets = housePlanets.length > 0;
            const isAscendant = houseNum === 1;
            return (
              <polygon
                key={`bg-${houseNum}`}
                points={HOUSE_POLYGONS[houseNum]}
                className={`house-bg house-${houseNum} ${hasPlanets ? 'has-planets' : ''} ${isAscendant ? 'ascendant-house' : ''}`}
              />
            );
          })}

          {/* Outer Border */}
          <rect x="2" y="2" width="396" height="396" rx="8" fill="none" stroke="url(#chart-border-grad)" strokeWidth="3" />

          {/* Diagonals */}
          <line x1="2" y1="2" x2="398" y2="398" stroke="rgba(169, 163, 194, 0.25)" strokeWidth="1.5" />
          <line x1="398" y1="2" x2="2" y2="398" stroke="rgba(169, 163, 194, 0.25)" strokeWidth="1.5" />

          {/* Inner Diamond */}
          <polygon points="200,2 2,200 200,398 398,200" fill="none" stroke="rgba(169, 163, 194, 0.35)" strokeWidth="2" />

          {/* Render sign numbers and planets for each house */}
          {Object.entries(houseLayout).map(([houseStr, pos]) => {
            const houseNum = parseInt(houseStr);
            const signNum = getSignForHouse(houseNum);
            const housePlanets = planetsByHouse[houseNum];

            return (
              <g key={houseNum} className={`house-group house-${houseNum}`}>
                {/* Sign Number Label */}
                <text
                  x={pos.signX}
                  y={pos.signY}
                  className="house-sign-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {signNum}
                </text>

                {/* Ascendant label 'लग्न' for House 1 */}
                {houseNum === 1 && (
                  <text
                    x={200}
                    y={154}
                    className="house-ascendant-tag"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    लग्न
                  </text>
                )}

                {/* Planet Abbreviations */}
                {housePlanets.length > 0 && (
                  <text
                    x={pos.planetsX}
                    y={pos.planetsY}
                    className="house-planets"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {housePlanets.map((p, idx) => (
                      <tspan
                        key={idx}
                        x={pos.planetsX}
                        dy={idx === 0 ? 0 : 16}
                        className="planet-span"
                        title={p.degree}
                      >
                        {p.name}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3 Metadata Pills below the chart */}
      <div className="chart-metadata-pills">
        <div className="chart-pill">
          <span className="pill-label">लग्न:</span>
          <span className="pill-value">{ascendant ? ascendant.split(' (')[0] : ''}</span>
        </div>
        <div className="chart-pill">
          <span className="pill-label">राशि:</span>
          <span className="pill-value">{rashi ? rashi.split(' (')[0] : ''}</span>
        </div>
        <div className="chart-pill">
          <span className="pill-label">नक्षत्र:</span>
          <span className="pill-value">{nakshatra ? nakshatra.split(' (')[0] : ''}</span>
        </div>
      </div>

      <div className="chart-legend">
        <h4 className="legend-title">ग्रह संकेत विवरण:</h4>
        <div className="legend-grid">
          <div><span>सू</span> सूर्य (Sun)</div>
          <div><span>चं</span> चन्द्र (Moon)</div>
          <div><span>मं</span> मंगल (Mars)</div>
          <div><span>बु</span> बुध (Mercury)</div>
          <div><span>गु</span> गुरु (Jupiter)</div>
          <div><span>शु</span> शुक्र (Venus)</div>
          <div><span>श</span> शनि (Saturn)</div>
          <div><span>रा</span> राहु (Rahu)</div>
          <div><span>के</span> केतु (Ketu)</div>
        </div>
      </div>
    </div>
  );
}
