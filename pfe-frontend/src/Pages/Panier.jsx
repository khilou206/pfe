import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/panier.css';

const Panier = () => {
    const { cart, removeItem, updateQty, total } = useCart();
    const navigate = useNavigate();

    return (
        <div className="pmn-cart-main-wrapper">
            <div className="pmn-cart-section-container">
                <div className="pmn-cart-header-title">
                    <h2>Mon Panier</h2>
                    <p>Gestion Des Produites</p>
                    <hr />
                </div>

                {cart.length > 0 ? (
                    <div className="pmn-cart-content">
                        <div className="pmn-cart-table-wrapper">
                            <table className="pmn-cart-data-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Aperçu</th>
                                        <th>Produit</th>
                                        <th>Prix Unit.</th>
                                        <th>Quantité</th>
                                        <th>Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <button onClick={() => removeItem(item.id)} className="btn-delete">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="pmn-cart-preview-box">
                                                    <img 
                                                        src={`http://127.0.0.1:8000${item.final_mockup}`} 
                                                        alt="Design Final" 
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="product-info">
                                                    <span className="product-name">{item.nom_produit}</span>
                                                    <small>ID: {item.id}</small>
                                                </div>
                                            </td>
                                            <td>{item.prix} DH</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={item.qte} 
                                                    onChange={(e) => updateQty(item.id, e.target.value)}
                                                    className="pmn-cart-qty-input"
                                                />
                                            </td>
                                            <td className="subtotal-cell">{(item.prix * item.qte).toFixed(2)} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pmn-cart-bottom-grid">
                            <div className="pmn-cart-summary-card">
                                <h5>Récapitulatif</h5>
                                <div className="summary-row"><span>Total HT</span><span>{total.toFixed(2)} DH</span></div>
                                <div className="summary-total"><span>Total TTC</span><span>{total.toFixed(2)} DH</span></div>
                                <button className="pmn-cart-btn-checkout" onClick={() => navigate('/checkout')}>
                                    Valider la Commande
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <h3>Votre panier est vide</h3>
                        <Link to="/upload" className="btn-back">Retour au Studio</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Panier;