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
// Panier.js

const removeItem = async (index, productId) => {
    // 1. طلب تأكيد من المستخدم
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit de votre panier ?")) {
        return;
    }

    try {
        if (token) {
            // 2. عيط للـ API باش يتمسح من الـ Database
            await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 3. مورا ما يتمسح من الباك، حيدو من الـ State ديال السلة
            const newCart = cart.filter((_, i) => i !== index);
            setCart(newCart);
            updateTotal(newCart);
            
            alert("Produit supprimé !");
        }
    } catch (err) {
        console.error("Erreur lors de la suppression", err);
        alert("Impossible de supprimer le produit pour le moment.");
    }
};
    // 1. جلب البيانات من الـ API
    useEffect(() => {
        const fetchCart = async () => {
            if (token) {
                try {
                    // ملاحظة: تأكد أن الرابط هو نفسو اللي في api.php (user-cart)
                    const res = await axios.get('http://127.0.0.1:8000/api/user-cart', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    // Laravel كيرجع البيانات، نزيدو ليها كمية افتراضية (qte: 1)
                    const dataWithQty = res.data.map(item => ({ 
                        ...item, 
                        qte: item.qte || 1 // إذا كانت كاينا في الـ DB نستعملوها، وإلا نديرو 1
                    }));
                    
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

   

    return (
        <div className="pmn-cart-main-wrapper">
            <div className="pmn-cart-section-container">
                <div className="pmn-cart-header-title">
                    <h2>Mon Panier</h2>
                    <p>Bienvenue, {user?.nom || 'محمد'}</p>
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
                                                <button onClick={() => removeItem(index, item.id)} className="btn-delete">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="pmn-cart-preview-box">
                                                    {/* هنا التعديل المهم: الـ final_mockup جاي فيه /storage/designs/... */}
                                                    <img 
                                                        src={`http://127.0.0.1:8000${item.final_mockup}`} 
                                                        alt="Design Final" 
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                        onError={(e) => { e.target.src = "/img/placeholder.jpg" }} // في حالة ما لقا صورة
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="product-info">
                                                    <span className="product-name">{item.nom_produit}</span>
                                                    <span className="product-details">Taille: {item.taille} | Couleur: {item.color}</span>
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
                            <div className="pmn-cart-summary-card">
                                <h5>Récapitulatif</h5>
                                <div className="summary-row"><span>Sous-total</span><span>{total.toFixed(2)} DH</span></div>
                                <div className="summary-row"><span>Livraison</span><span className="free-shipping">Gratuite</span></div>
                                <div className="summary-total"><span>Total</span><span>{total.toFixed(2)} DH</span></div>
                                <button className="pmn-cart-btn-checkout" onClick={() => navigate('/checkout', { state: { items: cart, total: total } })}>
                                    Valider la Commande
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h3>Votre panier est vide</h3>
                        <Link to="/upload" className="btn-back">Créer un design</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Panier;