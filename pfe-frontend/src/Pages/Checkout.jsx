import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const { token } = useContext(AuthContext);
    const { cart, total } = useCart(); 
    const [formData, setFormData] = useState({ city: '', zipcode: '', address: '' });
    const [loading, setLoading] = useState(false);
    const items = (location.state?.items && location.state.items.length > 0) 
                  ? location.state.items 
                  : cart;
    const totalPrice = location.state?.total || total;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            alert("Votre panier est vide.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/payment', {
                city: formData.city,
                zipcode: formData.zipcode,
                address: formData.address,
                items: items 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            console.error("Erreur Backend:", err.response?.data);
            alert(err.response?.data?.message || "Erreur lors du paiement");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="cx">
            <div className="cx-inner">
                <div className="cx-header">
                    <div className="cx-ornament">
                        <div className="cx-line"></div>
                        <div className="cx-hex"></div>
                        <div className="cx-line r"></div>
                    </div>
                    <h1 className="cx-title">Livraison</h1>
                    <p className="cx-sub">Finalisez votre commande</p>
                </div>

                <div className="cx-order">
                    <div>
                        <p className="cx-ol">Commande</p>
                        <p className="cx-ov">{items.length} produit{items.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="cx-secure-tag">Stripe ✦</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="cx-row">
                        <div className="cx-field">
                            <label>Ville</label>
                            <input
                                type="text"
                                placeholder="Ex: Casablanca"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                        </div>
                        <div className="cx-field">
                            <label>Code Postal</label>
                            <input
                                type="text"
                                placeholder="Ex: 20000"
                                value={formData.zipcode}
                                onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="cx-field full-width">
                        <label>Adresse complète</label>
                        <textarea
                            placeholder="Rue, quartier, numéro..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="cx-div"></div>

                    <div className="cx-total">
                        <span className="cx-total-lbl">Total à payer</span>
                        <span className="cx-total-amt">{totalPrice.toFixed(2)} DH</span>
                    </div>

                    <button
                        type="submit"
                        className="cx-btn"
                        disabled={loading || items.length === 0}
                    >
                        <span>{loading ? "Traitement..." : "Confirmer & Payer →"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;