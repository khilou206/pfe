import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail } from 'lucide-react';
import './Footer.css'

const Footer = () => {
    return (
        <div className="kp-ft-main">
            <div className="kp-ft-container">
                
                {/* 1. Brand Section */}
                <div className="kp-ft-col kp-ft-brand">
                    <div className="kp-ft-logo">
                        <div className="kp-ft-dot"></div>
                        <span>KHALIFI <span className="kp-ft-gradient">PUB</span></span>
                    </div>
                    <p className="kp-ft-text">
                        PrintMeNow est une plateforme qui offre un large éventail de produits personnalisables pour une expérience de shopping unique à Tanger.
                    </p>
                </div>

                {/* 2. Contact Section */}
                <div className="kp-ft-col">
                    <h3 className="kp-ft-title">Contact <span className="kp-ft-line"></span></h3>
                    <div className="kp-ft-contact-box">
                        <div className="kp-ft-contact-item">
                            <Mail size={14} className="kp-ft-icon" />
                            <a href="mailto:mohammedzahide3@gmail.com">mohammedzahide3@gmail.com</a>
                            <h4>+212 662 481 731</h4>
                        </div>
                        <div className="kp-ft-contact-item">
                            <Mail size={14} className="kp-ft-icon" />
                            <a href="mailto:mohammedkhilou13@gmail.com">mohammedkhilou13@gmail.com</a>
                            <h4>+212 770 960 797</h4>
                        </div>
                    </div>
                </div>

                {/* 3. Menu Section */}
                <div className="kp-ft-col">
                    <h3 className="kp-ft-title">Menu <span className="kp-ft-line"></span></h3>
                    <ul className="kp-ft-links">
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/produits">Produits</Link></li>
                        <li><Link to="/propos">À propos</Link></li>
                        <li><Link to="/upload">UP Design</Link></li>
                    </ul>
                </div>

                {/* 4. Newsletter Section */}
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