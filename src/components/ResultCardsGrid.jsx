import { useState } from 'react';
import iconSoulPurpose from '../assets/icon_soul_purpose.png';
import iconCareerTiming from '../assets/icon_career_timing.png';
import iconCurrentDasha from '../assets/icon_current_dasha.png';
import iconNext24Months from '../assets/icon_next_24_months.png';
import iconRemedies from '../assets/icon_remedies.png';

export default function ResultCardsGrid({ interpretations }) {
  const [selectedCard, setSelectedCard] = useState(null);

  if (!interpretations) return null;

  const cardConfig = [
    {
      key: 'soulPurpose',
      data: interpretations.soulPurpose,
      icon: iconSoulPurpose,
      gradient: 'linear-gradient(135deg, #F5B942, #F76FA0)',
      shadowColor: 'rgba(245, 185, 66, 0.4)'
    },
    {
      key: 'careerTiming',
      data: interpretations.careerTiming,
      icon: iconCareerTiming,
      gradient: 'linear-gradient(135deg, #4FD8E8, #7B2FF7)',
      shadowColor: 'rgba(79, 216, 232, 0.4)'
    },
    {
      key: 'currentDasha',
      data: interpretations.currentDasha,
      icon: iconCurrentDasha,
      gradient: 'linear-gradient(135deg, #7B2FF7, #2D1B69)',
      shadowColor: 'rgba(123, 47, 247, 0.4)'
    },
    {
      key: 'next24Months',
      data: interpretations.next24Months,
      icon: iconNext24Months,
      gradient: 'linear-gradient(135deg, #F76FA0, #F5B942)',
      shadowColor: 'rgba(247, 111, 160, 0.4)'
    },
    {
      key: 'remediesAndUpgrades',
      data: interpretations.remediesAndUpgrades,
      icon: iconRemedies,
      gradient: 'linear-gradient(135deg, #4FD8E8, #F5B942)',
      shadowColor: 'rgba(79, 216, 232, 0.4)'
    }
  ];

  return (
    <section className="results-section">
      <h2 className="section-title">आपका कुंडली भविष्यफल</h2>
      <div className="cards-grid">
        {cardConfig.map((card, idx) => {
          if (!card.data) return null;
          const formattedIdx = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={card.key}
              className="prediction-card reveal"
              style={{
                '--card-gradient': card.gradient,
                '--card-glow-color': card.shadowColor
              }}
              onClick={() => setSelectedCard(card)}
            >
              <div className="card-inner-glow"></div>
              <div className="card-header-row">
                <div className="card-icon-frame">
                  <img src={card.icon} alt={card.data.title} className="card-icon" />
                </div>
                <span className="card-number">{formattedIdx}</span>
              </div>
              <h3 className="card-title">{card.data.title}</h3>
              <p className="card-teaser">{card.data.teaser}</p>
              <div className="card-action">विस्तार से पढ़ें ✦</div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderTop: `4px solid ${selectedCard.key === 'soulPurpose' || selectedCard.key === 'next24Months' ? 'var(--accent-gold)' : 'var(--accent-cyan)'}`
            }}
          >
            <button className="modal-close" onClick={() => setSelectedCard(null)}>
              &times;
            </button>
            <div className="modal-header">
              <div className="modal-icon-frame" style={{ background: selectedCard.gradient }}>
                <img src={selectedCard.icon} alt={selectedCard.data.title} className="modal-icon" />
              </div>
              <h3 className="modal-title">{selectedCard.data.title}</h3>
            </div>
            <div className="modal-body">
              <p className="modal-teaser-large">{selectedCard.data.teaser}</p>
              <hr className="modal-divider" />
              <p className="modal-text-content">{selectedCard.data.content}</p>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setSelectedCard(null)}>
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
