import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; 

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const category = searchParams.get('categorie_produit') || 'all';
    const query = searchParams.get('search') || '';

    // Palette dyal l-alwan l-vibrant dyal l-matba3a
    const categoriesList = [
        { name: 'all', color: '#1a1a1a' },
        { name: 'T-SHIRT', color: '#ff3e6c' },
        { name: 'CHAIER', color: '#9381ff' },
        { name: 'TAPIS DE SOURIS', color: '#00d1ff' },
        { name: 'SWEATSHIRT', color: '#ffb703' },
        { name: 'POCHETTE', color: '#06d6a0' },
        { name: 'HORLOGE', color: '#ef476f' }
    ];
    const activeCategory = categoriesList.find(
        (cat) => cat.name === category
    );
    const isDarkColor = (color) => {
        return color === '#111' || color === '#1a1a1a';
    };

    useEffect(() => {
        const fetchProduits = async () => {
            setLoading(true);
            try {
                let url = `http://127.0.0.1:8000/api/products?`;
                if (category !== 'all') url += `categorie=${category}&`;
                if (query) url += `search=${query}`;
                const res = await axios.get(url);
                setProduits(res.data);
            } catch (err) {
                console.error("Erreur fetching products", err);
            }
            setLoading(false);
        };
        fetchProduits();
        window.scrollTo(0, 0);
    }, [category, query]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        // Hna zid l-logic dyal l-panier dyalk (Context aw Redux)
       alert(`Produit ajouté au: ${product.nom_produit}`);
    };

    return (
        <div className="pp-page-container">
            {/* --- Category Navigation (Under Main Header) --- */}
            <nav className="pp-category-nav">
                <div className="pp-nav-wrapper">
                    {categoriesList.map((cat) => (
                        <button 
                            key={cat.name} 
                            className={`pp-nav-item ${category === cat.name ? 'pp-active' : ''}`}
                            style={{ '--pp-accent': cat.color }}
                            onClick={() => setSearchParams({ categorie_produit: cat.name })}
                        >
                            {cat.name === 'all' ? 'TOUS' : cat.name}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="pp-main-content" >
                <header className="pp-header-section" style={{ backgroundColor: activeCategory?.color || '#111' }}>
                    <h1 className="pp-page-title" style={{ color: isDarkColor(activeCategory?.color) ? '#fff' : '#111'}}>
                        {query ? `Résultats: "${query}"` : 'Nos Produits'}
                    </h1>
                </header>

                <div className="pp-products-grid">
                    {loading ? (
                        <div className="pp-loader-box">
                            <div className="pp-spinner"></div>
                            <p>Chargement des produits...</p>
                        </div>
                    ) : (
                        produits.map((pro) => (
                            <div className="pp-product-card" key={pro.id}>
                                <div className="pp-image-holder">
                                    <img 
                                        src={`http://127.0.0.1:8000/storage/mockups/${pro.final_mockup}`} 
                                        alt={pro.nom_produit} 
                                    />
                                </div>
                                <div className="pp-info-holder">
                                    <span className="pp-tag">{pro.categorie_produit}</span>
                                    <h3 className="pp-name">{pro.nom_produit}</h3>
                                    <div className="pp-footer">
                                        <span className="pp-price">{pro.prix} MAD</span>
                                        <div className="pp-actions">
                                            <Link to={`/produit/${pro.id}`} className="pp-details-link">
                                                Détails
                                            </Link>
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
                        <p>Aucun produit trouvé pour cette sélection.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Produits;