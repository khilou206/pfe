import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; 

const Produits = () => {
    const [produits, setProduits] = useState([]);
<<<<<<< HEAD
    const [categories, setCategories] = useState([]); // State jdid l categories
=======
    const [categories, setCategories] = useState([]);
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Params matching Laravel: $request->category
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('search') || '';

<<<<<<< HEAD
    // 1. Color Map: Hado homa l-alwan lli k-t-tbeddel bihom l-page
=======
    const API_BASE = "http://127.0.0.1:8000";

    // Configuration dial l-alwan 3la 7sab smiyat l-categories
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
    const colorMap = {
        'all': '#1a1a1a',
        'T-SHIRT': '#ff3e6c',
        'CHAIER': '#9381ff',
        'TAPIS DE SOURIS': '#00d1ff',
        'SWEATSHIRT': '#ffb703',
        'POCHETTE': '#06d6a0',
        'HORLOGE': '#ef476f',
<<<<<<< HEAD
        'default': '#86868b' // Lon l-categories l-jdad
    };

    // 2. Function bach t-akhod l-lon 3la 7sab s-miya
=======
        'default': '#86868b'
    };

>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
    const getCategoryColor = (catName) => {
        return colorMap[catName.toUpperCase()] || colorMap['default'];
    };

    const activeCategoryColor = getCategoryColor(category);

    const isDarkColor = (color) => {
        return color === '#111' || color === '#1a1a1a';
    };

    // 3. Fetch Categories & Products
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
<<<<<<< HEAD
                const catRes = await axios.get('http://127.0.0.1:8000/api/available-categories');
                setCategories(['all', ...catRes.data]);
                let url = `http://127.0.0.1:8000/api/products?`;
                if (category !== 'all') url += `categorie=${category}&`;
=======
                // 1. Njibo l-categories mn l-API jdid (dynamic)
                const catRes = await axios.get(`${API_BASE}/api/categories`);
                setCategories(['all', ...catRes.data]);

                // 2. Fetch products b l-filtre dial category
                let url = `${API_BASE}/api/products?`;
                if (category !== 'all') url += `category=${category}&`; 
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
                if (query) url += `search=${query}`;
                
                const prodRes = await axios.get(url);
                setProduits(prodRes.data);
            } catch (err) {
<<<<<<< HEAD
                console.error("Erreur fetching data", err);
=======
                console.error("Erreur fetching data:", err);
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
            }
            setLoading(false);
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [category, query]);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
<<<<<<< HEAD
        alert(`Produit ajouté: ${product.nom_produit}`);
=======
        alert(`Ajouté au panier: ${product.nom_produit}`);
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
    };

    return (
        <div className="pp-page-container">
<<<<<<< HEAD
            {/* --- Category Navigation Dynamique --- */}
=======
            {/* --- Navigation Dynamique --- */}
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
            <nav className="pp-category-nav">
                <div className="pp-nav-wrapper">
                    {categories.map((catName) => {
                        const catColor = getCategoryColor(catName);
                        const isActive = category === catName;
<<<<<<< HEAD

=======
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
                        return (
                            <button 
                                key={catName}
                                className={`pp-nav-item ${isActive ? 'pp-active' : ''}`}
                                style={{
                                    '--pp-accent': catColor,
                                    background: isActive ? catColor : '',
                                    color: isActive ? '#fff' : ''
                                }}
<<<<<<< HEAD
                                onClick={() => setSearchParams({ categorie_produit: catName })}
=======
                                onClick={() => setSearchParams({ category: catName })}
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
                            >
                                {catName === 'all' ? 'TOUS' : catName}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <main className="pp-main-content">
<<<<<<< HEAD
                {/* --- Header li kiy-beddel l-lon --- */}
=======
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
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
<<<<<<< HEAD
                            <p>Chargement...</p>
=======
                            <p>Chargement en cours...</p>
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
                        </div>
                    ) : (
                        produits.map((pro) => (
                            <div className="pp-product-card" key={pro.id}>
                                <div className="pp-image-holder">
<<<<<<< HEAD
                                    <img src={`http://127.0.0.1:8000${pro.final_mockup}`} alt={pro.nom_produit} />
=======
                                    <img 
                                        src={`${API_BASE}${pro.final_mockup}`} 
                                        alt={pro.nom_produit} 
                                    />
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
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
<<<<<<< HEAD
                        <p>Aucun produit trouvé.</p>
=======
                        <p>Désolé, aucun produit trouvé.</p>
                        <Link to="/editor" className="pp-create-link">Créer mon premier design</Link>
>>>>>>> fb7571c6649e0b46bc37c92db794132396feaae3
                    </div>
                )}
            </main>
        </div>
    );
};

export default Produits;