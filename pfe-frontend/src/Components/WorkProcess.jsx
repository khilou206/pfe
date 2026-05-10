import React from 'react';
import '../styles/Process.css';

const AboutLight = () => {
  return (
    <section className="l-about-section">
      {/* Decorative Elements */}
      <div className="l-circle-deco"></div>
      
      <div className="l-about-container">
        <div className="l-about-visual">
          <div className="l-image-wrapper">
            <img src="imgs/about/logo.png" alt="Khalifi Pub Fès" className="l-main-img" />
          </div>
        </div>

        <div className="l-about-content">
          <div className="l-top-tag">QUI SOMMES-NOUS ?</div>
          
          <h2 className="l-title">
            L'expertise du <span className="l-gradient-text">Grand Format</span> <br />
            entre vos mains.
          </h2>

          <p className="l-description">
            Spécialistes en communication visuelle à <strong>Fès</strong>, nous accompagnons les entreprises 
            dans leur rayonnement local. De l'habillage de flottes automobiles à la signalétique lumineuse, 
            notre précision est notre signature.
          </p>

          <div className="l-benefits-list">
            <div className="l-benefit-item">
              <span className="l-check">✦</span>
              <div>
                <h4>Matériaux Certifiés</h4>
                <p>Résistance extrême au climat de Fès.</p>
              </div>
            </div>
            
            <div className="l-benefit-item">
              <span className="l-check">✦</span>
              <div>
                <h4>Design Sur-Mesure</h4>
                <p>Chaque projet est une pièce unique.</p>
              </div>
            </div>
          </div>

          <button className="l-cta-btn">
            Découvrir notre atelier
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutLight;