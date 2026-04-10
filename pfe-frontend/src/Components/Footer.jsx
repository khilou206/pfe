import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="roww">
                <div className="coll">
                    <img src="/imgs/print.png" className="footer_logo" style={{ width: "250px" }} alt="Logo" />
                    <p>
                        PrintMeNow est une plateforme qui offre un large éventail de produits personnalisables, 
                        avec notre site web d'impression à la demande peut également offrir une expérience 
                        de shopping unique et satisfaisante.
                    </p>
                </div>
                <div className="coll">
                    <h3>Contact <div className="bottom_line"><span></span></div></h3>
                    <p className="footer_email">mohammedzahide3@gamil.com</p>
                    <h4 style={{ color: "#b0b0b0" }}>+212 662 481 731</h4>
                    <p className="footer_email">mohammedkhilou13@gamil.com</p>
                    <h4 style={{ color: "#b0b0b0" }}>+212 770 960 797</h4>
                </div>
                <div className="coll">
                    <h3>Menu <div className="bottom_line"><span></span></div></h3>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/produits">Produits</Link></li>
                        <li><Link to="/propos">A propos</Link></li>
                        <li><Link to="/upload">UP Design</Link></li>
                    </ul>
                </div>
                <div className="coll">
                    <h3>Newsletter <div className="bottom_line"><span></span></div></h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <i className="fa-solid fa-envelope icon"></i>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">
                            <i className="fa-solid fa-arrow-right icon_right"></i>
                        </button>
                    </form>
                </div>
            </div>
            <hr />
            <p className="copyright">Print Me Now Ⓒ 2026 - Tout droits réservés</p>
        </footer>
    );
};

export default Footer;