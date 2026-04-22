import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/panier.css';

const Panier = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const getProductBaseImage = (category, color) => {
        const mapping = {
            'T-shirt': 'th1',
            'sweatshirt': 'hd1',
            'chaier': 'bk1',
            'horloge': 'rg1',
            'tapis souris': 'tp1',
            'pochette': 'ph1'
        };

        const baseName = mapping[category] || 'th1';
        
        
        const colorSuffix = (color && color !== 'white') ? `_${color}` : '_black';
        
        
       const extension = '.jpg';

      return `/img/${baseName}${colorSuffix}${extension}`;
    };

    
    useEffect(() => {
        const fetchCart = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://127.0.0.1:8000/api/my-cart', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const dataWithQty = res.data.map(item => ({ ...item, qte: 1 }));
                    setCart(dataWithQty);
                    updateTotal(dataWithQty);
                } catch (err) {
                    console.error("Erreur lors du chargement du panier", err);
                }
            }
        };
        fetchCart();
    }, [token]);

    const updateTotal = (items) => {
        const t = items.reduce((acc, item) => acc + (Number(item.prix) * item.qte), 0);
        setTotal(t);
    };

    const updateQty = (index, val) => {
        const newQty = Math.max(1, parseInt(val) || 1);
        const newCart = [...cart];
        newCart[index].qte = newQty;
        setCart(newCart);
        updateTotal(newCart);
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        updateTotal(newCart);
    };

    return (
        <div className="pmn-cart-main-wrapper">
            <div className="pmn-cart-section-container">
                <div className="pmn-cart-header-title">
                    <h2>Mon Panier</h2>
                    <p>Bienvenue, {user?.nom || 'Client'}</p>
                    <hr />
                </div>

                {cart.length > 0 ? (
                    <div className="pmn-cart-content">
                        <div className="pmn-cart-table-wrapper">
                            <table className="pmn-cart-data-table">
                                <thead>
                                    <tr>
                                        <th>Supprimer</th>
                                        <th>Aperçu</th>
                                        <th>Produit</th>
                                        <th>Prix Unit.</th>
                                        <th>Quantité</th>
                                        <th>Sous-total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>
                                                <button onClick={() => removeItem(index)} className="btn-delete">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                         <td>
    {item.final_mockup ? (
        <div className="pmn-cart-preview-box">
            <img 
                src={`http://127.0.0.1:8000/storage/mockups/${item.final_mockup}`} 
                alt="Product Preview" 
                style={{ width: '100px', height: '100px', objectFit: 'contain' }} 
            />
        </div>
    ) : (
        <div className="pmn-cart-preview-box" style={{ position: 'relative', width: '100px', height: '100px' }}>
             <img src={getProductBaseImage(item.categorie_produit, item.color)} style={{ width: '100%', position: 'absolute' }} />
             {item.images?.[0] && (
                 <img 
                    src={`http://127.0.0.1:8000/storage/logos/${item.images[0].nom_image}`} 
                    style={{
                        position: 'absolute',
                        left: `${(item.images[0].x / 440) * 100}%`,
                        top: `${(item.images[0].y / 490) * 100}%`,
                        width: `${(item.images[0].width / 500) * 100}%`,
                    }}
                 />
             )}
        </div>
    )}
</td>                            <td>
                                                <div className="product-info">
                                                    <span className="product-name">{item.nom_produit}</span>
                                                    <span className="product-cat">{item.categorie_produit}</span>
                                                </div>
                                            </td>
                                            <td>{item.prix} DH</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={item.qte} 
                                                    onChange={(e) => updateQty(index, e.target.value)}
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
                            <div className="pmn-cart-coupon-card">
                                <h5>Code Promo</h5>
                                <div className="coupon-input-group">
                                    <input type="text" placeholder="Entrez le code" />
                                    <button>Appliquer</button>
                                </div>
                            </div>

                            <div className="pmn-cart-summary-card">
                                <h5>Récapitulatif</h5>
                                <div className="summary-row">
                                    <span>Sous-total</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                                <div className="summary-row">
                                    <span>Livraison</span>
                                    <span className="free-shipping">Gratuite</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                                <button className="pmn-cart-btn-checkout" onClick={() => navigate('/checkout', { state: { items: cart } })}>
    Valider la Commande
</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h3>Votre panier est vide</h3>
                        <Link to="/produits" className="btn-back">Continuer mes achats</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Panier;