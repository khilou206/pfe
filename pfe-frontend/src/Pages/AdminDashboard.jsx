import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css'; 
import '../styles/Admin.css'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bord');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileColors, setFileColors] = useState({});
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [allProducts, setAllProducts] = useState([]); 

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleColorChange = (index, value) => {
        setFileColors({ ...fileColors, [index]: value });
    };

    const availableColors = [
        { name: 'Noir', hex: '#000000' },
        { name: 'Blanc', hex: '#FFFFFF' },
        { name: 'Gris', hex: '#808080' },
        { name: 'Rouge', hex: '#FF0000' },
        { name: 'Bleu', hex: '#0000FF' },
        { name: 'Vert', hex: '#008000' },
    ];

    const [selectedPalette, setSelectedPalette] = useState([]);
    const toggleColor = (hex) => {
        if (selectedPalette.includes(hex)) {
            setSelectedPalette(selectedPalette.filter(c => c !== hex));
        } else {
            setSelectedPalette([...selectedPalette, hex]);
        }
    };

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalClients: 0,
        activeProducts: 0,
        ordersByDay: []
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const statsRes = await axios.get('http://127.0.0.1:8000/api/admin/stats', config);
            setStats(statsRes.data.data);
            const ordersRes = await axios.get('http://127.0.0.1:8000/api/admin/orders', config);
            setOrders(ordersRes.data.data);
            
            const productsRes = await axios.get('http://127.0.0.1:8000/api/products', config);
            setAllProducts(productsRes.data);
            
        } catch (error) {
            if (error.response?.status === 401) navigate('/login');
            console.error("Erreur de chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!token || storedUser?.role !== 'administrateur') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [navigate, token]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Wach tiqqen bghiti tmseh had l-produit?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`, config);
                setAllProducts(allProducts.filter(p => p.id !== productId));
                alert("Produit t-mseh b naja7!");
            } catch (error) {
                console.error("Erreur delete:", error);
                alert("Erreur dans la suppression !!");
            }
        }
    };

    if (loading) return <div className="loading">Chargement des données...</div>;

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}/status`, { status: newStatus }, config);
            setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            alert("Statut mis à jour !");
        } catch (error) {
            console.error("Erreur update status:", error);
        }
    };

    const handleMockupSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            alert("المرجو اختيار صورة واحدة على الأقل");
            return;
        }
        const formData = new FormData();
        const autoName = selectedFiles[0].name.split('.').slice(0, -1).join('.');
        formData.append('nom_mockup', autoName);
        formData.append('prix_base', e.target.prix_base.value);
        formData.append('categorie_mockup', e.target.categorie_mockup.value);
        selectedFiles.forEach((file) => {
            formData.append('images[]', file); 
        });
        const finalColors = selectedPalette.length > 0 ? selectedPalette : ['#000000'];
        formData.append('colors', JSON.stringify(finalColors));
        try {
            const config = { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                } 
            };
            await axios.post('http://127.0.0.1:8000/api/admin/mockups', formData, config);
            alert("تم الحفظ بنجاح!");
            setSelectedFiles([]);
            setSelectedPalette([]);
            e.target.reset();
            fetchData(); // Refresh data bach t-update l-statut
        } catch (error) {
            console.error("Erreur:", error.response?.data);
            alert("خطأ في الحفظ: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="admin-dashboard">
            {selectedProductDetails && (
                <div className="modal-overlay" onClick={() => setSelectedProductDetails(null)} 
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} 
                        style={{ background: '#fff', padding: '30px', borderRadius: '15px', height:'90dvh', maxWidth: '500px', width: '90%', position: 'relative' }}>
                        <button onClick={() => setSelectedProductDetails(null)} style={{ position: 'absolute', right: '15px', top: '10px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                        <h3 style={{ marginBottom: '15px' }}>Détails du Produit</h3>
                        {selectedProductDetails.final_mockup && (
                            <img src={`http://127.0.0.1:8000${selectedProductDetails.final_mockup}`} alt="Final Product" style={{ width: '100%', borderRadius: '10px', marginBottom: '15px', border: '1px solid #ddd' }} />
                        )}
                        <div style={{ lineHeight: '1.6' }}>
                            <p><strong>Nom:</strong> {selectedProductDetails.nom_produit}</p>
                            <p><strong>Couleur:</strong> {selectedProductDetails.color}</p>
                            <p><strong>Taille:</strong> {selectedProductDetails.taille}</p>
                            <p><strong>Quantité:</strong> {selectedProductDetails.pivot?.qte || 1}</p>
                        </div>
                        {selectedProductDetails.design?.nom_design && (
                            <div style={{ marginTop: '15px' }}>
                                <a href={`http://127.0.0.1:8000/api/download-logo/${selectedProductDetails.design.nom_design}`} download={selectedProductDetails.design.nom_design} className="download-btn-highlight">
                                    📥 تحميل التصميم الأصلي (PNG)
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="main" style={{ display: 'flex', paddingLeft: '10%', paddingTop: '5%', alignItems: 'center' }}>
                <div className="profile-image">
                     <img src="/imgs/login.png" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1.5px solid #facc15' }} alt="User" />
                </div>
                <div className="profile-names" style={{ marginLeft: '20px' }}>
                    <h1 className="username" style={{ fontSize: '48px', margin: 0, color:'black' }}>{user?.nom || 'Admin'}</h1>
                    <small className="page-title" style={{ fontSize: '18px', color: '#666' }}>Administrateur</small>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'flex', marginTop: '40px', padding: '0 5%' }}>
                {/* Sidebar */}
                <div className="admin-sidebar" style={{ width: '250px' }}>
                    <button className={`nav-btn ${activeTab === 'bord' ? 'active' : ''}`} onClick={() => setActiveTab('bord')}>Tableau de bord</button>
                    <button className={`nav-btn ${activeTab === 'commandes' ? 'active' : ''}`} onClick={() => setActiveTab('commandes')}>Commandes</button>
                    <button className={`nav-btn ${activeTab === 'mockups' ? 'active' : ''}`} onClick={() => setActiveTab('mockups')}>Mockups</button>
                    <button className={`nav-btn ${activeTab === 'produits' ? 'active' : ''}`} onClick={() => setActiveTab('produits')}>Produits</button>
                </div>

                {/* Main Content */}
                <div className="admin-content" style={{ flex: 1, marginLeft: '50px' }}>

                    {activeTab === 'bord' && (
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="stat-card"><h3>{stats?.total_revenue || 0} DH</h3><p>Revenu Total</p></div>
                            <div className="stat-card"><h3>{stats?.total_orders || 0}</h3><p>Commandes</p></div>
                            <div className="stat-card"><h3>{stats?.total_clients || 0}</h3><p>Clients</p></div>
                            <div className="stat-card"><h3>{stats?.active_products || 0}</h3><p>Produits Actifs</p></div>
                            <div className="chart-container" style={{ gridColumn: '1 / -1', height: 350, marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '15px' }}>
                                <h3>Commandes par jour (7 derniers jours)</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.ordersByDay}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis /><Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'commandes' && (
                        <div className="section-p1">
                            <h2>Gestion des Commandes</h2>
                            <div className="table-container" style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>Réf</th><th>Client</th><th>Produits</th><th>Total</th><th>Statut</th><th>Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.reference_commande || order.id}</td>
                                                <td>Nam:{order.utilisateur?.nom} <br/>Email:<small>{order.utilisateur?.email}</small></td>
                                                <td>
                                                    {order.produits.map((p, index) => (
                                                        <div key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {p.final_mockup && <img src={`http://127.0.0.1:8000${p.final_mockup}`} alt="Final" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />}
                                                            <strong>{p.nom_produit}</strong>
                                                            <button onClick={() => setSelectedProductDetails(p)} className="view-details-btn" style={{ marginLeft: 'auto' }}>Voir Détails</button>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td><strong>{order.total_price} DH</strong></td>
                                                <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                                                <td>
                                                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="status-select">
                                                        <option value="pending">En attente</option><option value="shipped">Expédié</option><option value="delivered">Livré</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mockups' && (
                        <div className="add-mockup-section section-p1">
                            <h2>Ajouter un Nouveau Mockup</h2>
                            <form className="admin-form" onSubmit={handleMockupSubmit}>
                                <div className="input-group"><label>Catégorie:</label><input type="text" name="categorie_mockup" required /></div>
                                <div className="input-group"><label>Prix de Base (DH):</label><input type="number" name="prix_base" step="0.01" required /></div>
                                <div className="input-group"><label>Images (Sélectionnez plusieurs):</label><input type="file" multiple onChange={handleFileChange} /></div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '15px 0' }}>
                                    {availableColors.map((color) => (
                                        <div key={color.hex} onClick={() => toggleColor(color.hex)} style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: color.hex, border: selectedPalette.includes(color.hex) ? '3px solid #007bff' : '1px solid #ddd', cursor: 'pointer' }}></div>
                                    ))}
                                </div>
                                <button type="submit" className="main-btn">Enregistrer le Mockup</button>
                            </form>
                        </div>
                    )}

                    {/* ===== SECTION PRODUITS JDIDA ===== */}
                    {activeTab === 'produits' && (
                        <div className="section-p1">
                            <h2>Gestion des Produits</h2>
                            <div className="table-container" style={{ overflowX: 'auto', marginTop: '20px' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Nom</th>
                                            <th>Prix</th>
                                            <th>Catégorie</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allProducts.map(product => (
                                            <tr key={product.id}>
                                                <td><img src={`http://127.0.0.1:8000${product.final_mockup}`} alt="img" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} /></td>
                                                <td>{product.nom_produit}</td>
                                                <td>{product.prix} DH</td>
                                                <td>{product.categorie_nom}</td>
                                                <td>
                                                    <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;