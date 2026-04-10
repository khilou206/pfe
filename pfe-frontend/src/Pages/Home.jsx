import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard';
import '../styles/style3.css';

const Home = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const [tshirts, setTshirts] = useState([]);
    const [chaier, setChaier] = useState([]);
    const [loading, setLoading] = useState(true);

    // Backend URL (Laravel)
    const API_URL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resAll = await axios.get(`${API_URL}/products`);
                setLatestProducts(resAll.data);

                const resTshirt = await axios.get(`${API_URL}/products/category/t-shirt`);
                setTshirts(resTshirt.data);

                const resChaier = await axios.get(`${API_URL}/products/category/chaier`);
                setChaier(resChaier.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        console.log("Ajouté au panier:", product.nom_produit);
    };
    const scrollToProducts = () => {
        const section = document.getElementById('productS');
        section.scrollIntoView({ behavior: 'smooth' });
    };
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section id="hero">
                <img src="/imgs/1[Converted].png" id="stars" alt="stars" />
               
                <img src="/imgs/4[Converted].png" id="moons" alt="moons" />
                <h2 id="text">Print Me Now</h2>
                <button id="btn" onClick={scrollToProducts} style={{border: 'none', cursor: 'pointer'}}>
                    Voir plus
                </button>
                <img src="/imgs/2[Converted].png" id="mountain" alt="mountain" />
            </section>

            {/* FEATURES SECTION */}
            <section id="feature" className="section-p1">
                <div className="box">
                    <img src="/imgs/features/f1.png" alt="Free Shipping" />
                    <h6>Free Shipping</h6>
                </div>
                <div className="box">
                    <img src="/imgs/features/f2.png" alt="Online Order" />
                    <h6>Online Order</h6>
                </div>
                <div className="box">
                    <img src="/imgs/features/f3.png" alt="Save Money" />
                    <h6>Save Money</h6>
                </div>
                <div className="box">
                    <img src="/imgs/features/f4.png" alt="Promotions" />
                    <h6>Promotions</h6>
                </div>
                <div className="box">
                    <img src="/imgs/features/f5.png" alt="Happy Sell" />
                    <h6>Happy Sell</h6>
                </div>
                <div className="box">
                    <img src="/imgs/features/f6.png" alt="24/7 Support" />
                    <h6>24/7 Support</h6>
                </div>
            </section>

            {/* LATEST PRODUCTS */}
            <section id="product1" className="section-p1">
                <h2 id="productS">Produits</h2>
                <p>PrintMeNow</p>
                <div className="container-home">
                    {latestProducts.map(product => (
                        <ProductCard 
                            key={product.id_product} 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    ))}
                </div>
            </section>

            {/* BANNER */}
            <section id="banner" className="section-m1">
                <h4>PrintMeNow</h4>
                <h2>une expérience de shopping <span>unique</span> et satisfaisante.</h2>
                <button className="normal">
                    <a href="/all-products" style={{textDecoration: 'none', color: 'inherit'}}>Voir plus</a>
                </button>
            </section>

            {/* T-SHIRTS CATEGORY */}
            <section id="product1" className="section-p1">
                <h2>T-SHIRT</h2>
                <p>PrintMeNow</p>
                <div className="container-home">
                    {tshirts.map(product => (
                        <ProductCard 
                            key={product.id_product} 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    ))}
                </div>
            </section>

            {/* CHAIER CATEGORY */}
            <section id="product1" className="section-p1">
                <h2>CHAIER</h2>
                <p>PrintMeNow</p>
                <div className="container-home">
                    {chaier.map(product => (
                        <ProductCard 
                            key={product.id_product} 
                            product={product} 
                            onAddToCart={handleAddToCart} 
                        />
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;