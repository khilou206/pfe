import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/success.css';

const SuccessPage = () => {
    const { setCart } = useCart();

    useEffect(() => {

        setCart([]);
        localStorage.removeItem('pmn_cart');
    }, [setCart]);

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="status-box animation-in">
                    <div className="check-icon">✦</div>
                    <h1>Paiement Réussi !</h1>
                    <p>
                        Merci pour votre confiance. <br />
                        Votre commande a été enregistrée avec succès.
                    </p>
                    <div className="action-buttons">
                        <Link to="/profile" className="btn-primary">Voir mes commandes</Link>
                        <Link to="/" className="btn-secondary">Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;