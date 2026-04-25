import React from 'react';
import { Target, Zap, Crown, Flame, Shield, Fingerprint, Globe, Sparkles } from 'lucide-react';
import '../styles/About.css';


const About = () => {
  return (
    <div className="kp-pro-about">
      {/* --- Section 1: Hero Neo-Brutalism --- */}
      <header className="kp-pro-hero">
        <div className="kp-pro-tag">
          <Sparkles size={14} className="kp-pro-sparkle" />
          <span>PROJET PIXEL-PERFECT 2026</span>
        </div>
        <h1 className="kp-pro-display">
          L'Impression <br />
          <span className="kp-pro-outline">Sans Limites.</span>
        </h1>
        <p className="kp-pro-lead">
          KHALIFI PUB n'est pas une simple agence. C'est l'épicentre de la 
          créativité visuelle à Tanger, où chaque détail compte.
        </p>
      </header>

      {/* --- Section 2: Bento Grid (The "Wow" Part) --- */}
      <section className="kp-pro-bento">
        {/* Large Card: Vision */}
        <div className="kp-bento-item kp-bento-main">
          <div className="kp-bento-content">
            <Fingerprint size={40} className="kp-icon-acc" />
            <h2>Notre Identité</h2>
            <p>On ne se contente pas d'imprimer. On calibre chaque pigment pour que votre marque respire la perfection.</p>
          </div>
          <div className="kp-bento-visual">
            <div className="kp-visual-circle"></div>
          </div>
        </div>

        {/* Small Card: Tech */}
        <div className="kp-bento-item kp-bento-glass">
          <Zap size={24} color="#4ade80" />
          <h3>Vitesse Ultra</h3>
          <p>Livraison en 24h pour vos projets urgents à Tanger.</p>
        </div>

        {/* Small Card: Quality */}
        <div className="kp-bento-item kp-bento-dark">
          <Shield size={24} color="#c084fc" />
          <h3>Blindé</h3>
          <p>Supports résistants aux UV et aux intempéries.</p>
        </div>

        {/* Wide Card: Stats */}
        <div className="kp-bento-item kp-bento-wide">
          <div className="kp-stat-row">
            <div className="kp-stat-unit">
              <span className="kp-stat-num">500+</span>
              <span className="kp-stat-label">Clients</span>
            </div>
            <div className="kp-stat-unit">
              <span className="kp-stat-num">10Y</span>
              <span className="kp-stat-label">Expertise</span>
            </div>
            <div className="kp-stat-unit">
              <span className="kp-stat-num">100%</span>
              <span className="kp-stat-label">Qualité</span>
            </div>
          </div>
        </div>

        {/* Square Card: Creative */}
        <div className="kp-bento-item kp-bento-gradient">
          <Flame size={24} />
          <h3>Creative Hub</h3>
        </div>
      </section>

      {/* --- Section 3: Floating Call-to-Action --- */}
      <div className="kp-pro-footer-action">
        <h3>Prêt à marquer l'histoire ?</h3>
        <button className="kp-pro-btn">Démarrer un projet</button>
      </div>
    </div>
  );
};

export default About;