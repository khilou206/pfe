import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    // Get query mn l-URL (e.g. ?query=t-shirt)
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/search?query=${query}`);
                setProducts(res.data);
            } catch (err) {
                console.error("Erreur search:", err);
            }
            setLoading(false);
        };

        if (query) fetchSearchResults();
    }, [query]);

    return (
        <section className="section-p1" style={{ marginTop: '100px', padding: '40px 80px' }}>
            <h2 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Résultats pour : <span style={{ color: '#e4b946' }}>"{query}"</span></h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>{products.length} produits trouvés</p>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="pro-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {products.map(product => (
                        <div key={product.id_produit} className="pro" style={{ 
                            width: '23%', 
                            border: '1px solid #ebebeb', 
                            padding: '10px', 
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}>
                            <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.nom} style={{ width: '100%', borderRadius: '20px' }} />
                            <div className="des" style={{ textAlign: 'start', padding: '10px 0' }}>
                                <span style={{ color: '#606063', fontSize: '12px' }}>{product.categorie}</span>
                                <h5 style={{ paddingTop: '7px', color: '#1a1a2e', fontSize: '14px' }}>{product.nom}</h5>
                                <h4 style={{ paddingTop: '7px', fontSize: '15px', fontWeight: '700', color: '#e4b946' }}>{product.prix} DH</h4>
                            </div>
                            <Link to={`/produit/${product.id_produit}`}>
                                <i className="fa-solid fa-cart-shopping cart" style={{ 
                                    width: '40px', height: '40px', lineHeight: '40px', borderRadius: '50%', 
                                    background: '#e8f6ea', color: '#e4b946', textAlign: 'center' 
                                }}></i>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            
            {products.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>Aucun produit ne correspond à votre recherche.</h3>
                    <Link to="/produits" style={{ color: '#e4b946' }}>Voir tous les produits</Link>
                </div>
            )}
        </section>
    );
};

export default SearchPage;