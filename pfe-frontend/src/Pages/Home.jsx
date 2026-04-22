import React from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import './Home.css'

const Home = () => {
  return (
    <section className="hero-wrapper">
      
      <div className="glow-bg">
        <div className="glow" style={{ width: '40vw', height: '40vw', top: '-10%', right: '-5%', background: '#4ade80' }}></div>
        <div className="glow" style={{ width: '40vw', height: '40vw', bottom: '-10%', left: '-5%', background: '#c084fc' }}></div>
      </div>

      <div style={{ zIndex: 2, padding: '0 5%', position: 'relative' }}>
     
        <div style={{ 
          display: 'inline-block', padding: '6px 16px', borderRadius: '50px', 
          background: 'var(--card-bg)', border: '1px solid var(--border-color)', marginBottom: '2rem' 
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
        Agence Publicitaire & Impression
          </span>
        </div>

        <h1 className="hero-main-title">
          VOTRE VISION, <br />
          <span className="gradient-text">NOTRE IMPRESSION.</span>
        </h1>

        <p style={{ maxWidth: '600px', margin: '0 auto 3rem auto', color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: '1.7' }}>
          De la conception graphique à l'installation finale, Khalifi Pub transforme vos idées en réalité visuelle avec une précision absolue.
        </p>

        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-creative" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Lancer un projet <ArrowRight size={18} />
          </button>
          
          <button style={{ 
            background: 'none', border: '1px solid var(--border-color)', 
            color: 'var(--text-main)', padding: '1rem 2.2rem', borderRadius: '100px', 
            fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' 
          }}>
            Portfolio <MoveRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;