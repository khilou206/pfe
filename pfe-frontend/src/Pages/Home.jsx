import React from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import '../styles/Home.css';
import AboutLight from '../Components/WorkProcess';

const Home = () => {
  
  const handleMouseMove = (e) => {
  for(const card of document.getElementsByClassName("bento-item")) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};

  return <>
    <section className="hero-wrapper">
        <div className="floating-container">
        <div className="f-img img-1"><img src="imgs/about/a5.jpg" alt="1" /></div>
        <div className="f-img img-2"><img src="imgs/about/a6.jpg" alt="2" /></div>
        <div className="f-img img-3"><img src="imgs/about/a4.png" alt="3" /></div>
      </div>
      {/* -------------------------------------- */}

      <div className="glow-bg">
        <div className="glow" style={{ width: '40vw', height: '40vw', top: '-10%', right: '-5%', background: '#4ade80' }}></div>
        <div className="glow" style={{ width: '40vw', height: '40vw', bottom: '-10%', left: '-5%', background: '#c084fc' }}></div>
      </div>

      <div style={{ zIndex: 2, padding: '0 5%', position: 'relative', textAlign: 'center' }}>
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
    <section className='imgTa'>
      <img src="imgs/about/cover.png" alt="" />
    </section>
    <section className="premium-features">
  <div className="bento-grid">
    {/* Card 1 - Blue */}
    <div className="bento-item tall card-blue">
      <div className="bento-content">
        <img src="imgs/features/f1.png" alt="" className="bento-icon" style={{ width: '200px' }} />
        <div className="bento-text">
          <h3>Free Shipping</h3>
          <p>Service premium sans frais cachés.</p>
        </div>
      </div>
    </div>

    {/* Card 2 - Green */}
    <div className="bento-item small card-green">
      <div className="bento-content">
        <img src="imgs/features/f2.png" alt="" className="bento-icon-s" style={{ width: '150px' }} />
        <h6>Online Order</h6>
      </div>
    </div>

    {/* Card 3 - Orange */}
    <div className="bento-item small card-orange">
      <div className="bento-content">
        <img src="imgs/features/f3.png" alt="" className="bento-icon-s" style={{ width: '160px' }} />
        <h6>Save Money</h6>
      </div>
    </div>

    {/* Card 4 - Purple */}
    <div className="bento-item wide card-purple">
      <div className="bento-content" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="bento-text">
          <h3>24/7 Support</h3>
          <p>Toujours là pour vous, jour et nuit.</p>
        </div>
        <img src="imgs/features/f6.png" alt="" className="bento-icon-w" style={{ width: '210px' }} />
      </div>
    </div>

    {/* Card 5 - Rose */}
    <div className="bento-item small card-rose">
      <div className="bento-content">
        <img src="imgs/features/f4.png" alt="" className="bento-icon-s" style={{ width: '170px' }} />
        <h6>Promotions</h6>
      </div>
    </div>

    {/* Card 6 - Indigo */}
    <div className="bento-item wide card-indigo">
      <div className="bento-content">
        <img src="imgs/features/f5.png" alt="" className="bento-icon-s" style={{ width: '150px' }} />
        <h6>Happy Sell</h6>
      </div>
    </div>
  </div>
</section>
<AboutLight />
    </>
};

export default Home;
