import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({ city: '', zipcode: '', address: '' });
    const [loading, setLoading] = useState(false);

    // التأكد من أن الـ items موجودة
    const items = location.state?.items || [];

    // حساب المجموع بطريقة آمنة
    const totalPrice = items.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            alert("السلة فارغة. يرجى إضافة منتجات أولاً.");
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
            alert(err.response?.data?.message || "وقع مشكل أثناء معالجة الدفع");
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

                <div className="cx-steps">
                    <div className="cx-step done"></div>
                    <div className="cx-step done"></div>
                    <div className="cx-step active"></div>
                    <div className="cx-step"></div>
                </div>

                <div className="cx-order">
                    <div>
                        <p className="cx-ol">Commande</p>
                        <p className="cx-ov">{items.length} produit{items.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="cx-secure-tag">Stripe ✦</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className="cx-lbl">Adresse de livraison</p>

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
                        <span className="cx-total-amt">{totalPrice} DH</span>
                    </div>

                    <button
                        type="submit"
                        className="cx-btn"
                        disabled={loading}
                    >
                        <span>{loading ? "Traitement..." : "Confirmer & Payer →"}</span>
                    </button>
                </form>

                
            </div>
        </div>
    );
};

export default Checkout;