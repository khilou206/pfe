import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; 

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('search') || '';

    const API_BASE = "http://127.0.0.1:8000";
    const colorMap = {
        'all': '#1a1a1a',
        'T-SHIRT': '#ff3e6c',
        'CHAIER': '#9381ff',
        'TAPIS DE SOURIS': '#00d1ff',
        'SWEATSHIRT': '#ffb703',
        'POCHETTE': '#06d6a0',
        'HORLOGE': '#ef476f',
        'default': '#86868b'
    };

    const getCategoryColor = (catName) => {
        return colorMap[catName.toUpperCase()] || colorMap['default'];
    };

    const activeCategoryColor = getCategoryColor(category);

    const isDarkColor = (color) => {
        return color === '#111' || color === '#1a1a1a';
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Njibo l-categories mn l-API jdid (dynamic)
                const catRes = await axios.get(`${API_BASE}/api/categories`);
                setCategories(['all', ...catRes.data]);

                // 2. Fetch products b l-filtre dial category
                let url = `${API_BASE}/api/products?`;
                if (category !== 'all') url += `category=${category}&`; 
                if (query) url += `search=${query}`;
                
                const prodRes = await axios.get(url);
                setProduits(prodRes.data);
            } catch (err) {
                console.error("Erreur fetching data:", err);
            }
            setLoading(false);
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [category, query]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`Ajouté au panier: ${product.nom_produit}`);
    };

    return (
        <div className="pp-page-container">
            {/* --- Navigation Dynamique --- */}
            <nav className="pp-category-nav">
                <div className="pp-nav-wrapper">
                    {categories.map((catName) => {
                        const catColor = getCategoryColor(catName);
                        const isActive = category === catName;
                        return (
                            <button 
                                key={catName}
                                className={`pp-nav-item ${isActive ? 'pp-active' : ''}`}
                                style={{
                                    '--pp-accent': catColor,
                                    background: isActive ? catColor : '',
                                    color: isActive ? '#fff' : ''
                                }}
                                onClick={() => setSearchParams({ category: catName })}
                            >
                                {catName === 'all' ? 'TOUS' : catName}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <main className="pp-main-content">
                <header 
                    className="pp-header-section"
                    style={{ '--headerColor': activeCategoryColor }}
                >
                    <h1 
                        className="pp-page-title"
                        style={{ color: isDarkColor(activeCategoryColor) ? '#fff' : '#111' }}
                    >
                        {query ? `Résultats: "${query}"` : category === 'all' ? 'Nos Produits' : `Nos ${category}`}
                    </h1>
                </header>

                <div className="pp-products-grid">
                    {loading ? (
                        <div className="pp-loader-box">
                            <div className="pp-spinner"></div>
                            <p>Chargement en cours...</p>
                        </div>
                    ) : (
                        produits.map((pro) => (
                            <div className="pp-product-card" key={pro.id}>
                                <div className="pp-image-holder">
                                    <img 
                                        src={`${API_BASE}${pro.final_mockup}`} 
                                        alt={pro.nom_produit} 
                                    />
                                </div>
                                <div className="pp-info-holder">
                                    {/* Jib smiya mn relation mockup hit f produit makaynach */}
                                    <span className="pp-tag">
                                        {pro.mockup?.categorie_mockup || 'Produit'}
                                    </span>
                                    <h3 className="pp-name">{pro.nom_produit}</h3>
                                    <div className="pp-footer">
                                        <span className="pp-price">{pro.prix} MAD</span>
                                        <div className="pp-actions">
                                            <Link to={`/produit/${pro.id}`} className="pp-details-link">Détails</Link>
                                            <button className="pp-add-cart-btn" onClick={(e) => handleAddToCart(e, pro)}> + Panier </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && produits.length === 0 && (
                    <div className="pp-empty">
                        <p>Désolé, aucun produit trouvé.</p>
                        <Link to="/editor" className="pp-create-link">Créer mon premier design</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Produits;