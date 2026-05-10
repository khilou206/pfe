import React from "react";
import '../styles/paragraph.css';
import { Link } from "react-router-dom";

export default function Paragraph(){

    return<>
        <section className="kp-about">
  <div className="kp-container">

    <div className="kp-left">
      <h1 className="kp-title">
        Impression &
        <span> Publicité Moderne</span>
      </h1>
      <p className="kp-description">
        Khalifi PUB est une imprimerie publicitaire moderne basée à Fès,
        spécialisée dans les solutions de communication visuelle et les
        impressions professionnelles. L’entreprise propose plusieurs services
        comme l’habillage des véhicules, les panneaux publicitaires,
        l’impression grand format, les panneaux numériques ainsi que les
        bâches et banderoles personnalisées.
      </p>

      <p className="kp-description">
        Grâce à sa nouvelle plateforme digitale, les utilisateurs peuvent
        désormais importer leurs designs, les visualiser directement sur
        des mockups réalistes puis commander leurs produits en ligne
        facilement.
      </p>

      <div className="kp-services">
        <div className="kp-service-card">
          <img src="services/pub_voiture.png" alt="" />
          <h3>Habillage Auto</h3>
        </div>
        <div className="kp-service-card">
          <img src="services/pub_g.png" alt="" />
          <h3>Grand Format</h3>
        </div>
        <div className="kp-service-card">
          <img src="services/pub_panneau2.png" alt="" />
          <h3>Panneaux</h3>
        </div>
        <div className="kp-service-card">
          <img src="img/bg1.png" alt="" />
          <h3>Mockup Live</h3>
        </div>
      </div>
      <div className="kp-buttons">
        <Link to={'/upload'} className="kp-btn-primary">
          Découvrir
        </Link>
        <Link to={'/produits'} className="kp-btn-secondary">
          Commander
        </Link>
      </div>
    </div>
    <div className="kp-right">
      <div className="kp-image kp-image-3">
        <img src="imgs/logo_p_por.png" alt="" />
      </div>

    </div>

  </div>
</section>
    </>
}