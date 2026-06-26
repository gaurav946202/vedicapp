import { useState, useRef } from 'react';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import BirthDetailsForm from './components/BirthDetailsForm';
import ResultCardsGrid from './components/ResultCardsGrid';
import BirthChartWheel from './components/BirthChartWheel';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  const resultsRef = useRef(null);

  const handleCtaClick = () => {
    const formSection = document.getElementById('birth-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setShowResults(false);

    try {
      const response = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dob: formData.date,
          timeOfBirth: formData.time,
          approximateTime: formData.approximateTime,
          placeOfBirth: formData.place,
          ...(formData.lat != null ? { lat: formData.lat, lng: formData.lng } : {}),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'कुंडली बनाने में समस्या हुई।');
      }

      const data = await response.json();
      setResultsData(data);
      setShowResults(true);

      // Smooth scroll to predictions/chart
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      alert('क्षमा करें, ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background Starfield Ambiance */}
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="glow-nebula-left"></div>
      <div className="glow-nebula-right"></div>

      <Hero onCtaClick={handleCtaClick} />
      <TrustBar />

      <main className="main-content">
        <BirthDetailsForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {showResults && resultsData && (
          <div ref={resultsRef} className="results-wrapper fade-in">
            <div className="results-grid-layout">
              {/* Left Column: predictions */}
              <div className="predictions-column">
                <ResultCardsGrid interpretations={resultsData.interpretations} />
              </div>

              {/* Right Column: dynamic SVG chart wheel */}
              <div className="chart-column">
                <BirthChartWheel chartData={resultsData.chartData} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
