import heroImage from '../assets/hero_cosmic_deity.png';

export default function Hero({ onCtaClick }) {
  return (
    <header className="hero-section">
      <div className="hero-glow-nebula"></div>
      <div className="hero-content">
        <div className="hero-eyebrow-badge">✦ वैदिक ज्योतिष ✦</div>
        <h1 className="hero-headline">
          अपनी जन्म कुंडली<br />से अपना भाग्य जानें
        </h1>
        <p className="hero-subheadline">
          वैदिक ज्योतिष से करियर, आत्मा का उद्देश्य और आगामी 24 महीनों की भविष्यवाणी।
        </p>
        <div className="hero-cta-wrapper">
          <button className="btn-cta" onClick={onCtaClick}>
            कुंडली बनाएं <span className="arrow">↓</span>
          </button>
          <div className="hero-trust-line">✦ 9 ग्रह · 27 नक्षत्र · वास्तविक गणना ✦</div>
        </div>
      </div>
      <div className="hero-image-container">
        <div className="hero-image-glow-backdrop"></div>
        <div className="hero-outer-ring"></div>
        <div className="hero-image-wrapper">
          <div className="hero-image-glow"></div>
          <img
            src={heroImage}
            alt="वैदिक ब्रह्मांडीय ऊर्जा और देवता"
            className="hero-image"
          />
        </div>
      </div>
      
      <div className="hero-scroll-indicator" onClick={onCtaClick}>
        <span className="scroll-text">नीचे स्क्रॉल करें</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </header>
  );
}
