import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import '../styles/product.css'; 

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    // Kant 3ndek 'category', ghadi n-redouha 'categorie_produit' bach t-matchi l-URL
    const currentCategory = searchParams.get('categorie_produit') || 'all';
    const query = searchParams.get('search') || '';

    const API_BASE = "http://127.0.0.1:8000";

    const handleAddToCart = (product) => {
        const item = {
            id: product.id,
            nom_produit: product.nom_produit, 
            prix: product.prix,
            image: product.final_mockup, 
            qte: 1
        };
        addToCart(item);
        alert(`Produit ajouté: ${product.nom_produit}`);
    };

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

    const activeCategoryColor = getCategoryColor(currentCategory);

    const isDarkColor = (color) => {
        return color === '#111' || color === '#1a1a1a';
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const catRes = await axios.get(`${API_BASE}/api/available-categories`);
                setCategories(['all', ...catRes.data]);
                let url = `${API_BASE}/api/products?`;
                if (currentCategory !== 'all') url += `categorie=${currentCategory}&`;
                if (query) url += `search=${query}`;
                
                const prodRes = await axios.get(url);
                setProduits(prodRes.data);
            } catch (err) {
                console.error("Erreur fetching data", err);
            }
            setLoading(false);
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [currentCategory, query]); 

    return (
        <div className="pp-page-container">
            <nav className="pp-category-nav">
                <div className="pp-nav-wrapper">
                    {categories.map((catName) => {
                        const catColor = getCategoryColor(catName);
                        const isActive = currentCategory === catName;

                        return (
                            <button 
                                key={catName}
                                className={`pp-nav-item ${isActive ? 'pp-active' : ''}`}
                                style={{
                                    '--pp-accent': catColor,
                                    background: isActive ? catColor : '',
                                    color: isActive ? '#fff' : ''
                                }}
                                // Set l-URL parameter b-nefs smit l-variable (categorie_produit)
                                onClick={() => setSearchParams({ categorie_produit: catName })}>
                                {catName === 'all' ? 'TOUS' : catName}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <main className="pp-main-content">
                <header 
                    className="pp-header-section"
                    style={{ '--headerColor': activeCategoryColor }}>
                    <h1 className="pp-page-title" style={{ color: isDarkColor(activeCategoryColor) ? '#fff' : '#111' }}>
                        {query ? `Résultats: "${query}"` : currentCategory === 'all' ? 'Nos Produits' : `Nos ${currentCategory}`}
                    </h1>
                </header>

                <div className="pp-products-grid">
                    {loading ? (
                        <div className="pp-loader-box">
                            <div className="pp-spinner"></div>
                            <p>Chargement...</p>
                        </div>
                    ) : (
                        produits.map((pro) => (
                            <div className="pp-product-card" key={pro.id}>
                                <div className="pp-image-holder">
                                    <img src={`${API_BASE}${pro.final_mockup}`} alt={pro.nom_produit} />
                                </div>
                                <div className="pp-info-holder">
                                    <span className="pp-tag">{pro.categorie_produit}</span>
                                    <h3 className="pp-name">{pro.nom_produit}</h3>
                                    <div className="pp-footer">
                                        <span className="pp-price">{pro.prix} MAD</span>
                                        <div className="pp-actions">
                                            <Link to={`/produit/${pro.id}`} className="pp-details-link">Détails</Link>
                                            <button className="pp-add-cart-btn" onClick={() => handleAddToCart(pro)}> + Panier </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && produits.length === 0 && (
                    <div className="pp-empty">
                        <p>Aucun produit trouvé.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Produits;