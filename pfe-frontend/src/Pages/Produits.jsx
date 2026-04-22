import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; 

const Produits = () => {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    
    const category = searchParams.get('categorie_produit') || 'all';
    const query = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProduits = async () => {
            setLoading(true);
            try {
            
                let url = `http://127.0.0.1:8000/api/produits?`;
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
    }, [category, query]);

    return (
       
        <main className="produitC">
            
        
            <div style={{ width: '90vw', margin: '0 auto' }}>
                <h2 className="tag">
                    {query ? `Résultat de recherche pour "${query}"` : 
                    (category === 'all' ? 'Nos Produits' : category.toUpperCase())}
                </h2>
                {query && <p>{produits.length} Résultats trouvés</p>}
            </div>

           
            <section className="related-products">
                {loading ? (
                    <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '50px'}}>
                        <h3>Chargement...</h3>
                    </div>
                ) : (
                    produits.map((pro) => (
                       
                        <div className="product-card" key={pro.id_produit}>
                            <img 
                                src={`http://127.0.0.1:8000/storage/${pro.image}`} 
                                alt={pro.nom} 
                            />
                            <h3>{pro.nom}</h3>
                            <p>{pro.categorie_produit}</p>
                            
                          
                            <h4 style={{ color: 'var(--color-accent)', fontWeight: 'bold', margin: '10px 0' }}>
                                {pro.prix} MAD
                            </h4>

                            <Link to={`/produit-detail/${pro.id_produit}`} className="btn">
                                Voir Détails
                            </Link>
                        </div>
                    ))
                )}
            </section>

            {!loading && produits.length === 0 && (
                <div style={{ width: '100%', textAlign: 'center', padding: '50px' }}>
                    <p>Aucun produit ne correspond à votre recherche.</p>
                </div>
            )}
        </main>
    );
};

export default Produits;