import React from 'react';
import '../styles/Services.css';

const ServicesGallery = () => {
  // 10 Services b nafss l-istructure
  const services = [
    { id: 1, title: "Habillage Voiture", img: "/services/pub_voiture.png" },
    { id: 2, title: "Panneaux Publicitaires", img:  "/services/pub_panneau.png"  },
    { id: 3, title: "Enseignes Lumineuses", img:  "/services/pub_lights.png"  },
    { id: 4, title: "Totems extèrieurs", img:  "/services/pub_totems.png" },
    { id: 5, title: "Trophy", img:  "/services/pub_trophy.png"  },
    { id: 6, title: "Marquage Véhicule", img:  "/services/pub_voiture2.png"  },
    { id: 7, title: "Bâches & Banderoles", img :"/services/pub_totems2.png" },
    { id: 8, title: "Signalétique Bureau", img:  "/services/pub_panneau3.png"  },
    { id: 9, title: "Impression Grand Format", img:  "/services/pub_g.png"  },
    { id: 10, title: "Roll Up", img:  "/services/pub_rollup.png" },
    { id: 11, title: "Grandes-Paneaux", img:  "/services/pub_panneau2.png" },
    { id: 12, title: "PAnneaux Numiriques", img:  "/services/pub_pandigit.png" },
  ];

  return (
    <section className="h-uni-section">
      <div className="h-uni-header">
        <h2 className="h-uni-title">Nos Réalisations</h2>
        <div className="h-uni-line"></div>
      </div>

      <div className="h-uni-grid">
        {services.map((s) => (
          <div key={s.id} className="h-uni-card">
            <div className="h-uni-img-wrapper">
              <img src={s.img} alt={s.title} className="h-uni-img" />
              <div className="h-uni-overlay">
                <span className="h-uni-text">{s.title}</span>
                <div className="h-uni-plus">+</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGallery;