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

    const categoriesList = [
        { name: 'all', color: '#1a1a1a' },
        { name: 'T-SHIRT', color: '#ff3e6c' },
        { name: 'CHAIER', color: '#9381ff' },
        { name: 'TAPIS DE SOURIS', color: '#00d1ff' },
        { name: 'SWEATSHIRT', color: '#ffb703' },
        { name: 'POCHETTE', color: '#06d6a0' },
        { name: 'HORLOGE', color: '#ef476f' }
    ];

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
        window.scrollTo(0, 0); // Bach mlli t-clicki t-tla3 l-fouq
    }, [category, query]);

    const handleCategoryClick = (catName) => {
        setSearchParams({ categorie_produit: catName });
    };

    return (
        <main className="produit-page-wrapper">
            {/* --- NAV BAR L-FOUQ GA3 --- */}
            <header className="page-header-nav">
                <nav className="nav-wrapper">
                    {categoriesList.map((cat) => (
                        <div 
                            key={cat.name} 
                            className={`nav-item ${category === cat.name ? 'active' : ''}`}
                            style={{ '--active-color': cat.color }}
                            onClick={() => handleCategoryClick(cat.name)}>
                            {cat.name === 'all' ? 'TOUS' : cat.name}
                        </div>
                    ))}
                </nav>
            </header>

            <div className="page-content">
                <div className="content-header">
                    <h1 className="main-title">
                        {query}
                    </h1>
                </div>

                <section className="products-grid">
                    {loading ? (
                        <div className="loader-container"><div className="spinner"></div></div>
                    ) : (
                        produits.map((pro) => (
                            <div className="modern-product-card" key={pro.id}>
                                <div className="image-container">
                                    <img src={`http://127.0.0.1:8000/storage/mockups/${pro.final_mockup}`} alt={pro.nom_produit} />
                                </div>
                                <div className="card-info">
                                    <span className="cat-tag">{pro.categorie_produit}</span>
                                    <h3>{pro.nom_produit}</h3>
                                    <div className="card-footer">
                                        <span className="price">{pro.prix} MAD</span>
                                        <Link to={`/produit/${pro.id}`} className="view-btn">Détails</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </main>
    );
};

export default Produits;