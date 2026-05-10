import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail } from 'lucide-react';
import './Footer.css'

const Footer = () => {
    return (
        <div className="kp-ft-main">
            <div className="kp-ft-container">
                <div className="kp-ft-col kp-ft-brand">
                    <div className="kp-ft-logo">
                        <div className="kp-ft-dot"></div>
                        <span>KHALIFI <span className="kp-ft-gradient">PUB</span></span>
                    </div>
                    <p className="kp-ft-text">
                        PrintMeNow est une plateforme qui offre un large éventail de produits 
                        personnalisables pour une expérience de shopping unique à Fès.
                    </p>
                </div>
                <div className="kp-ft-col">
                    <h3 className="kp-ft-title">Contact <span className="kp-ft-line"></span></h3>
                    <div className="kp-ft-contact-box">
                        <div className="kp-ft-contact-item">
                            <Mail size={14} className="kp-ft-icon" />
                            <a href="mailto:mohammedzahide3@gmail.com">pubkhalifi@gmail.com</a>
                            <h4>+212 611 307 005</h4>
                        </div>
                    </div>
                </div>
                <div className="kp-ft-col">
                    <h3 className="kp-ft-title">Menu <span className="kp-ft-line"></span></h3>
                    <ul className="kp-ft-links">
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/produits">Produits</Link></li>
                        <li><Link to="/propos">À propos</Link></li>
                        <li><Link to="/upload">UP Design</Link></li>
                    </ul>
                </div>
                <div className="kp-ft-col">
                    <h3 className="kp-ft-title">Newsletter <span className="kp-ft-line"></span></h3>
                    <form className="kp-ft-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Votre email" required />
                        <button type="submit"><Send size={16} /></button>
                    </form>
                </div>
            </div>
            <div className="kp-ft-bottom">
                <hr className="kp-ft-hr" />
                <p className="kp-ft-copy">KHALIFI PUB Ⓒ 2026 - Tout droits réservés</p>
            </div>
        </div>
    );
};

export default Footer;