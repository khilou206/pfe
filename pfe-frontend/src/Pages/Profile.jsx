import React, { useState, useEffect, useContext } from 'react';
import { 
    LayoutDashboard, 
    Palette, 
    Shirt, 
    Package, 
    Settings, 
    Search,
    Plus
} from 'lucide-react';
import '../styles/profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    // --- Configuration & States ---
    const [activeTab, setActiveTab] = useState('bord');
    const { user, token } = useContext(AuthContext);
    const [userProducts, setUserProducts] = useState([]);
    const [userDesigns, setUserDesigns] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
    if (user && token) {
        fetchDesigns();
        fetchOrders();
        fetchProducts();
    }
}, [user, token]);

    const API_BASE_URL = "http://127.0.0.1:8000";

    const navItems = [
        { id: 'bord', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'design', label: 'Designs', icon: Palette },
        { id: 'produits', label: 'Produits', icon: Shirt },
        { id: 'commandes', label: 'Commandes', icon: Package },
        { id: 'profil', label: 'Paramètres', icon: Settings }
    ];

    // --- API Functions ---
    const fetchDesigns = () => {
        if (!user || !token) return;
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/designs/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUserDesigns(res.data))
        .catch(err => console.error("Error designs:", err))
        .finally(() => setLoading(false));
    };

    const fetchOrders = () => {
        if (!user || !token) return;
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/user-orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUserOrders(res.data.data || []))
        .catch(err => console.error("Error orders:", err))
        .finally(() => setLoading(false));
    };

    const fetchProducts = () => {
        if (!user || !token) return;
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/user-products`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.data && res.data.data) {
                setUserProducts(res.data.data);
            }
        })
        .catch(err => console.error("Error products:", err))
        .finally(() => setLoading(false));
    };

    // --- Lifecycle ---
    useEffect(() => {
        if (activeTab === 'design') fetchDesigns();
        if (activeTab === 'commandes') fetchOrders();
        if (activeTab === 'produits') fetchProducts();
    }, [activeTab]);

    return (
        <div className="h-profile-root">
            {/* --- HEADER --- */}
            <header className="h-header-section">
                <div className="h-user-info">
                    <div className="h-avatar-wrapper">
                        <img src="/imgs/login.png" className="h-avatar-box" alt="User Avatar" />
                    </div>
                    <div className="h-user-details">
                        <h1 className="username">{user?.nom || 'Utilisateur'}</h1>
                        <span className="page-title-badge">{user?.role || 'UI/UX Designer'}</span>
                    </div>
                </div>
                    <Link to="/upload" >
                        <img src='/imgs/up.png' className="h-icon-btn" />
                    </Link>
            </header>

            <div className="h-layout-body">
                {/* --- SIDEBAR --- */}
                <aside className="h-sidebar-nav">
                    {navItems.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <label 
                                key={tab.id} 
                                className={activeTab === tab.id ? 'active' : ''}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="nav-icon">
                                    <IconComponent size={20} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
                                </span>
                                <span className="nav-label">{tab.label}</span>
                            </label>
                        );
                    })}
                </aside>

                {/* --- CONTENT AREA --- */}
                <main className="h-content-area">
                    {loading && <div className="h-global-loader">Chargement...</div>}

                    {/* VIEW: DASHBOARD */}
                    {!loading && activeTab === 'bord' && (
                        <div className="h-dashboard-view">
                            <h2 className="section-title">Vue d'ensemble</h2>
                            <div className="important-data">
                                <div className="data-item border-blue">
                                    <h3 className="value">0 <small>MAD</small></h3>
                                    <p className="title">Revenus</p>
                                </div>
                                <div className="data-item border-orange">
                                    <h3 className="value">{userDesigns.length}</h3>
                                    <p className="title">Assets Saved</p>
                                </div>
                                <div className="data-item border-green">
                                    <h3 className="value">{userOrders.length}</h3>
                                    <p className="title">Commandes</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: DESIGNS */}
                    {!loading && activeTab === 'design' && (
                        <div className="h-designs-view">
                            <h2 className="section-title">Mes Assets</h2>
                            <div className="h-designs-grid">
                                {userDesigns.map(design => (
                                    <div key={design.id} className="h-design-card">
                                        <div className="h-img-wrapper">
                                            <img src={`http://127.0.0.1:8000/storage/logos/${design.nom_design}`} alt="Design" />
                                        </div>
                                        <div className="h-card-actions">
                                            <button className="del-btn">Supprimer</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VIEW: PRODUITS (MOCKUPS) */}
                    {!loading && activeTab === 'produits' && (
                        <div className="h-products-view">
                            <div className="h-section-header">
                                <h2 className="section-title">Ma Collection</h2>
                                <p className="section-subtitle">Vos designs appliqués sur nos produits.</p>
                            </div>
                            <div className="h-products-grid">
                                {userProducts.length > 0 ? userProducts.map((product) => (
                                    <div key={product.id} className="h-product-card">
                                        <div className="h-product-preview">
                                            <img 
                                                src={product.final_mockup?.startsWith('data:') 
                                                    ? product.final_mockup 
                                                    : `${API_BASE_URL}${product.final_mockup}`} 
                                                alt={product.nom_produit} 
                                            />
                                        </div>
                                        <div className="h-product-info">
                                            <h4 className="h-p-name">{product.nom_produit}</h4>
                                            <div className="h-p-details">
                                                <span className="h-p-price">{product.prix} MAD</span>
                                                <span className="h-p-size">{product.taille}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-empty-state">
                                        <p>Aucun produit créé.</p>
                                        <Link to="/upload">Lancer le créateur</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: COMMANDES */}
                    {!loading && activeTab === 'commandes' && (
                        <div className="h-orders-view">
                            <h2 className="section-title">Mes Commandes</h2>
                            <div className="h-table-card">
                                <table className="h-custom-table">
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Produit</th>
                                            <th>Total</th>
                                            <th>État</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.reference_commande}</td>
                                                <td>{order.produits?.[0]?.nom_produit || 'Custom Item'}</td>
                                                <td>{order.total_price} MAD</td>
                                                <td><span className="status-badge">{order.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;