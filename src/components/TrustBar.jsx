export default function TrustBar() {
  return (
    <section className="trust-bar-section reveal">
      <div className="trust-bar-container">
        <div className="trust-item">
          <div className="trust-icon">🪐</div>
          <div className="trust-text">
            <span className="trust-title">वास्तविक ग्रह गणना</span>
            <span className="trust-subtitle">Prokerala API से</span>
          </div>
        </div>
        <div className="trust-divider">✦</div>
        <div className="trust-item">
          <div className="trust-icon">✨</div>
          <div className="trust-text">
            <span className="trust-title">नक्षत्र-आधारित दशा</span>
            <span className="trust-subtitle">सटीक तिथि-समय</span>
          </div>
        </div>
        <div className="trust-divider">✦</div>
        <div className="trust-item">
          <div className="trust-icon">🔮</div>
          <div className="trust-text">
            <span className="trust-title">हिंदी में व्याख्या</span>
            <span className="trust-subtitle">Claude AI से</span>
          </div>
        </div>
      </div>
    </section>
  );
}
