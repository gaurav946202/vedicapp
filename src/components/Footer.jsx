export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-om-symbol">ॐ</div>
        <div className="footer-brand">वैदिक कुंडली</div>
        <p className="footer-tagline">
          ब्रह्मांडीय ज्ञान और प्राचीन वैदिक विज्ञान का एक आधुनिक संगम।
        </p>
        <div className="footer-divider"></div>
        <p className="footer-disclaimer">
          अस्वीकरण (Disclaimer): यह विश्लेषण केवल मार्गदर्शन और आध्यात्मिक रुचि के लिए है। इसे किसी भी प्रकार के व्यावसायिक, कानूनी, चिकित्सीय या वित्तीय निर्णय के लिए पेशेवर सलाह का विकल्प न माना जाए।
        </p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} वैदिक कुंडली. सभी अधिकार सुरक्षित हैं।
        </p>
      </div>
    </footer>
  );
}
