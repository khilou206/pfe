import React from 'react';
import '../styles/biograph.css';

const ProjectOwner = () => {
  return (
    <section className="h-owner-wrapper">
      <div className="h-owner-container">
        <div className="h-owner-card-glass">
          <div className="h-owner-visual">
            <div className="h-visual-blob"></div>
            <div className="h-image-frame">
              <img 
                src="imgs/about/yassine.png" 
                alt="Khalifi" 
                className="h-main-avatar"
              />
              <div className="h-badge-experience">
                <span className="h-exp-num">10+</span>
                <span className="h-exp-text">ANS D'EXPERT</span>
              </div>
            </div>
          </div>
          <div className="h-owner-details">
            <div className="h-intro-header">
              <div className="h-line-dec"></div>
              <span className="h-subtitle">VISIONNAIRE & FONDATEUR</span>
            </div>
            <h2 className="h-title-name">
              M. Khalifi <span className="h-accent-dot">Yassine</span>
            </h2>
            <p className="h-description">
              Fondateur de <strong>KHALIFI PUB</strong>, passionné par le design, 
              l’impression publicitaire et l’innovation digitale. 
              J’accompagne les entreprises et les marques à Fès dans la création 
              d’une identité visuelle forte grâce à des solutions modernes, 
              créatives et un service d’impression de haute qualité.
            </p>
            <div className="h-stats-mini">
              <div className="h-stat-item">
                <strong>500+</strong>
                <span>Projets</span>
              </div>
              <div className="h-stat-item">
                <strong>100%</strong>
                <span>Qualité</span>
              </div>
            </div>

            <div className="h-footer-links">
              <div className="h-social-group">
                <a href="https://www.instagram.com/yassinlkhlifi/" target='_blank' className="h-icon-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="h-icon-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
              
              <button className="h-action-button">
                Parlons de votre projet
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectOwner;