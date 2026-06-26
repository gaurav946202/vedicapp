import { useState, useRef, useEffect } from 'react';

const HINTS = [
  "ग्रहों की स्थिति की गणना हो रही है",
  "नक्षत्र और दशा का विश्लेषण",
  "AI से हिंदी व्याख्या तैयार हो रही है"
];

export default function BirthDetailsForm({ onSubmit, isLoading }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [place, setPlace] = useState('');
  const [placeCoords, setPlaceCoords] = useState(null); // { lat, lng } when picked from dropdown
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % HINTS.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      setProgressIndex(0);
    };
  }, [isLoading]);

  const handlePlaceChange = (e) => {
    const val = e.target.value;
    setPlace(val);
    setPlaceCoords(null); // clear confirmed coords when user edits manually

    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (s) => {
    setPlace(s.display);
    setPlaceCoords({ lat: s.lat, lng: s.lng });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!date || (!time && !unknownTime) || !place) {
      alert("कृपया सभी आवश्यक फ़ील्ड भरें!");
      return;
    }
    onSubmit({
      date,
      time: unknownTime ? '12:00' : time,
      place,
      approximateTime: unknownTime,
      ...(placeCoords ?? {}),
    });
  };

  return (
    <section className="form-section-container" id="birth-form-section">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-glow-backdrop"></div>
          <div className="spinner-mandala-svg">
            <svg viewBox="0 0 200 200" width="200" height="200" className="loading-svg">
              {/* Outer Ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="2"
                strokeDasharray="8, 6"
                className="loading-ring-outer"
              />
              {/* Middle Ring */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
                strokeDasharray="6, 5"
                className="loading-ring-middle"
              />
              {/* Inner Mandala */}
              <g className="loading-mandala-inner">
                <circle cx="100" cy="100" r="40" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
                <polygon points="100,60 128,72 140,100 128,128 100,140 72,128 60,100 72,72" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
                <polygon points="100,60 140,100 100,140 60,100" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
                <polygon points="128,72 128,128 72,128 72,72" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
              </g>
              {/* Center Dot */}
              <circle cx="100" cy="100" r="6" fill="var(--accent-gold)" className="loading-center-dot" />
            </svg>
          </div>
          <p className="loading-text">आपकी कुंडली बन रही है...</p>
          <div className="loading-subtext-container">
            <span className="loading-subtext fade-in-out-hint">
              {HINTS[progressIndex]}
            </span>
          </div>
        </div>
      ) : (
        <div className="form-card glass-card">
          <div className="corner-star top-left">✦</div>
          <div className="corner-star top-right">✦</div>
          <div className="corner-star bottom-left">✦</div>
          <div className="corner-star bottom-right">✦</div>
          
          <div className="form-sanskrit-symbol">ॐ</div>
          <h2 className="form-title">अपना जन्म विवरण भरें</h2>
          <p className="form-subtitle">सटीक परिणाम के लिए सही जानकारी दें</p>
          <form onSubmit={handleFormSubmit} className="birth-form">
            <div className="form-group">
              <label htmlFor="birth-date">जन्म तिथि</label>
              <input
                type="date"
                id="birth-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birth-time">जन्म समय</label>
              <input
                type="time"
                id="birth-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={unknownTime}
                required={!unknownTime}
              />
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="unknown-time"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                />
                <label htmlFor="unknown-time">मुझे सही समय नहीं पता</label>
              </div>
              {unknownTime && (
                <p className="helper-text">
                  हम दोपहर 12 बजे का अनुमान उपयोग करेंगे, परिणाम कम सटीक हो सकते हैं।
                </p>
              )}
            </div>

            <div className="form-group autocomplete-group">
              <label htmlFor="birth-place">जन्म स्थान</label>
              <input
                type="text"
                id="birth-place"
                placeholder="गाँव, शहर या जिला दर्ज करें..."
                value={place}
                onChange={handlePlaceChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                required
                autoComplete="off"
              />
              {isSearching && (
                <p style={{ fontSize: '12px', opacity: 0.6, margin: '4px 0 0' }}>खोज रहे हैं...</p>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((s, idx) => {
                    const parts = s.display.split(', ');
                    const name = parts[0];
                    const context = parts.slice(1).join(', ');
                    return (
                      <li key={idx} onMouseDown={() => handleSelectSuggestion(s)}>
                        <span style={{ display: 'block', fontWeight: 500 }}>{name}</span>
                        {context && (
                          <span style={{ display: 'block', fontSize: '12px', opacity: 0.65 }}>
                            {context}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button type="submit" className="btn-submit">
              चार्ट देखें ✦
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
