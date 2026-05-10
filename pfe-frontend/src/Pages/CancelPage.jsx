import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cancel.css'; 

const CancelPage = () => {
    return (
        <div className="cancel-container">
            <div className="cancel-card">
                <div className="cancel-status-box animation-in">
                    <div className="cancel-icon">✕</div>
                    <h1>Paiement Annulé</h1>
                    <p>
                        Il semble que vous avez annulé l'opération de paiement. 
                        Pas d'inquiétude, vos articles sont toujours dans votre panier.
                    </p>
                    
                    <div className="cancel-action-buttons">
                        <Link to="/panier" className="btn-cancel-primary">
                            Retourner au panier
                        </Link>
                        <Link to="/" className="btn-cancel-secondary">
                            Continuer mes achats
                        </Link>
                    </div>

                    <div className="support-hint">
                        Besoin d'aide ? <Link to="/contact">Contactez-nous</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;