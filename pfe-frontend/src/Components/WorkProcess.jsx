import React from 'react';
import '../styles/Process.css';

const AboutPremium = () => {
  return (
    <section className="p-about-section">
      {/* Elements de style f l-background */}
      <div className="p-blob-1"></div>
      <div className="p-blob-2"></div>

      <div className="p-about-container">
        <div className="p-about-content">
          <div className="p-badge">
            <span className="p-badge-dot"></span>
            L'excellence à Tanger
          </div>
          
          <h2 className="p-about-title">
            Plus qu'une impression, <br />
            <span>Une Identité Visuelle.</span>
          </h2>

          <p className="p-about-text">
            Chez <strong>KHALIFI PUB</strong>, nous fusionnons l'art du design avec les technologies 
            d'impression les plus avancées. Notre mission est de transformer chaque véhicule 
            et chaque façade en un puissant outil de communication.
          </p>

          <div className="p-features-grid">
            <div className="p-feat-item">
              <div className="p-feat-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h4>Qualité Premium</h4>
                <p>Vinyle haute résistance.</p>
              </div>
            </div>

            <div className="p-feat-item">
              <div className="p-feat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div>
                <h4>Rapidité</h4>
                <p>Respect des délais.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-about-visual">
          <div className="p-image-stack">
            <div className="p-img-card p-main">
              <img src="/api-assets/car-wrap-pro.jpg" alt="Work" />
            </div>
            <div className="p-img-card p-floating glass">
              <div className="p-stat">
                <span className="p-stat-num">98%</span>
                <span className="p-stat-label">Clients Satisfaits</span>
              </div>
            </div>
            <div className="p-deco-dots"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPremium;