import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panier.css';

const Panier = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('panier')) || [];
        setCart(savedCart);
        calculateTotal(savedCart);
    }, []);

    const calculateTotal = (items) => {
        let t = items.reduce((acc, item) => acc + (Number(item.prix) * Number(item.qte)), 0);
        setTotal(t);
    };

    const removeItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('panier', JSON.stringify(newCart));
        calculateTotal(newCart);
    };

    const updateQty = (index, val) => {
        const newQty = parseInt(val);
        if (newQty > 0) {
            const newCart = [...cart];
            newCart[index].qte = newQty;
            setCart(newCart);
            localStorage.setItem('panier', JSON.stringify(newCart));
            calculateTotal(newCart);
        }
    };

    return (
        <div className="pmn-cart-main-wrapper">
            <div className="pmn-cart-section-container">
                <div className="pmn-cart-header-title">
                    <h2>Mon Panier</h2>
                    <hr />
                </div>

                {cart.length > 0 ? (
                    <div className="pmn-cart-content">
                        <div className="pmn-cart-table-wrapper">
                            <table className="pmn-cart-data-table">
                                <thead>
                                    <tr>
                                        <th>Supprimer</th>
                                        <th>Image</th>
                                        <th>Produit</th>
                                        <th>Prix</th>
                                        <th>Quantité</th>
                                        <th>Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button onClick={() => removeItem(index)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <img 
                                                    className="pmn-cart-item-img" 
                                                    src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000/storage/${item.image}`} 
                                                    alt={item.produit} 
                                                />
                                            </td>
                                            <td style={{ fontWeight: '600' }}>{item.produit}</td>
                                            <td>{item.prix} DH</td>
                                            <td>
                                                <input 
                                                    className="pmn-cart-qty-input" 
                                                    type="number" 
                                                    value={item.qte} 
                                                    onChange={(e) => updateQty(index, e.target.value)}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 'bold', color: '#4d3087' }}>{(item.prix * item.qte).toFixed(2)} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pmn-cart-bottom-grid">
                            <div className="pmn-cart-coupon-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
                                <h5 style={{ color: '#1a1a2e', marginBottom: '15px' }}>Code Promo</h5>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" placeholder="Entrez le code" style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                                    <button style={{ padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '5px' }}>Appliquer</button>
                                </div>
                            </div>

                            <div className="pmn-cart-summary-card">
                                <h5>Récapitulatif</h5>
                                <div className="pmn-cart-summary-row">
                                    <span>Sous-total</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                                <div className="pmn-cart-summary-row">
                                    <span>Livraison</span>
                                    <span>Gratuite</span>
                                </div>
                                <div className="pmn-cart-summary-row" style={{ marginTop: '15px', fontSize: '1.4rem', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '15px' }}>
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                                <button className="pmn-cart-btn-checkout" onClick={() => navigate('/checkout')}>
                                    Valider la Commande
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <i className="fa-solid fa-cart-arrow-down" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                        <h3 style={{ marginTop: '20px', color: '#666' }}>Votre panier est actuellement vide.</h3>
                        <Link to="/produits" className="pmn-cart-btn-checkout" style={{ display: 'inline-block', width: 'auto', marginTop: '20px', textDecoration: 'none' }}>
                            Retour à la boutique
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Panier;