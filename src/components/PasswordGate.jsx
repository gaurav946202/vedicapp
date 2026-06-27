import { useState } from 'react';

const CORRECT = import.meta.env.VITE_APP_PASSWORD;
const SESSION_KEY = 'vedicapp_unlocked';

export function isUnlocked() {
  if (!CORRECT) return true; // no password set → open access
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === CORRECT) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <div className="password-gate-overlay">
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="glow-nebula-left"></div>
      <div className="glow-nebula-right"></div>

      <div className={`password-gate-card glass-card${error ? ' gate-shake' : ''}`}>
        <div className="form-sanskrit-symbol">ॐ</div>
        <h2 className="form-title" style={{ marginBottom: '0.25rem' }}>वैदिक कुंडली</h2>
        <p className="form-subtitle" style={{ marginBottom: '1.8rem' }}>पासवर्ड दर्ज करें</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="••••••••"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ textAlign: 'center', letterSpacing: '0.2em', touchAction: 'manipulation', fontSize: '16px' }}
          />
          {error && (
            <p style={{ color: '#f76fa0', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
              गलत पासवर्ड। पुनः प्रयास करें।
            </p>
          )}
          <button type="submit" className="btn-submit">प्रवेश करें ✦</button>
        </form>
      </div>
    </div>
  );
}
