import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; 

const ProductDetail = () => {
    const { id } = useParams(); // Jbed l-ID mn l-URL
    const [produit, setProduit] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States dyal l-Selections
    const [count, setCount] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('black');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                
<<<<<<< HEAD
                const res = await axios.get(`http://127.0.0.1:8000/api/produits/${id}`);
                setProduit(res.data);

                
                const resRelated = await axios.get(`http://127.0.0.1:8000/api/produits`);
=======
                const res = await axios.get(`http://127.0.0.1:8000/api/product/${id}`);
                setProduit(res.data);

                
                const resRelated = await axios.get(`http://127.0.0.1:8000/api/products`);
>>>>>>> origin
               
                const filtered = resRelated.data
                    .filter(p => p.id !== parseInt(id))
                    .slice(0, 4);
                setRelatedProducts(filtered);
            } catch (err) {
                console.error("Erreur fetching data", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

  
    const increaseCount = () => setCount(prev => prev + 1);
    const decreaseCount = () => setCount(prev => (prev > 1 ? prev - 1 : 1));
//========================================================================================
    const addToCart = () => {
        const cartItem = {
            id : produit.id,
            nom: produit.nom_produit,
            prix: produit.prix,
            image: produit.final_mockup,
            qte: count,
            size: selectedSize,
            color: selectedColor
        };
        
        let panier = JSON.parse(localStorage.getItem('panier')) || [];
<<<<<<< HEAD
        
        
=======
>>>>>>> origin
        const existingIndex = panier.findIndex(p => 
            p.id === cartItem.id && 
            p.size === cartItem.size && 
            p.color === cartItem.color
        );
        
        if (existingIndex !== -1) {
            panier[existingIndex].qte += count;
        } else {
            panier.push(cartItem);
        }

        localStorage.setItem('panier', JSON.stringify(panier));
        alert("Produit ajouté au panier !");
    };

    if (loading) return <div className="produitC"><h2>Chargement...</h2></div>;
    if (!produit) return <div className="produitC"><h2>Produit introuvable.</h2></div>;

    return (
        <main>
            <section className="produitC section-p1">
                <div className="container-Product">
                    {/* --- Left Side: Images --- */}
                    <div className="imageC">
                        <div 
                            className="img" 
                            style={{ backgroundImage: `url(http://127.0.0.1:8000/storage/${produit.final_mockup})` }}
                        ></div>
                        <div className="imgs">
                            {/* Thumbnails (Gallerie) */}
                            {[1, 2, 3, 4].map((_, i) => (
                                <div className="imgcol" key={i}>
                                    <img src={`http://127.0.0.1:8000/storage/${produit.final_mockup}`} alt="gallery" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="informationC">
                        <div className="product">
                            <div className="product-categorie">
                                <h6>{produit.categorie_produit || 'T-shirt'}</h6>
                            </div>
                            <div className="product-title">
                                <h2>{produit.nom_produit}</h2>
                            </div>
                            <div className="product-price">
                                <p>{produit.prix} MAD</p>
                            </div>
                            
                            <div className="product-rating">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <span className="review">(47 Reviews)</span>
                            </div>

                            {/* Size Selection */}
                            <div className="product-size">
                                <h4>Size</h4>
                                <div className="size-layout">
                                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <React.Fragment key={size}>
                                            <input 
                                                type="radio" 
                                                name="size" 
                                                id={`size-${size}`} 
                                                className="size-input" 
                                                checked={selectedSize === size}
                                                onChange={() => setSelectedSize(size)}
                                            />
                                            <label htmlFor={`size-${size}`} className="size">{size}</label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className="product-color">
                                <h4>Color</h4>
                                <div className="color-layout">
                                    {['black', 'red', 'blue'].map(color => (
                                        <React.Fragment key={color}>
                                            <input 
                                                type="radio" 
                                                name="color" 
                                                id={`color-${color}`} 
                                                className="color-input" 
                                                checked={selectedColor === color}
                                                onChange={() => setSelectedColor(color)}
                                            />
                                            <label htmlFor={`color-${color}`} className={color}></label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Counter */}
                            <div className="counter">
                                <span className="down" onClick={decreaseCount}>-</span>
                                <input type="text" value={count} readOnly />
                                <span className="up" onClick={increaseCount}>+</span>
                            </div>

                            <span className="divider"></span>

                            <div className="product-btn-group">
                                <button className="buy-now" onClick={addToCart}><span>Buy Now</span></button>
                                <button className="add-cart" onClick={addToCart}>+ Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Related Products Section --- */}
                <h2 className="tag">Related Products</h2>
                <div className="related-products">
                    {relatedProducts.map(rp => (
                        <div className="product-card" key={rp.id}>
                            <img src={`http://127.0.0.1:8000/storage/${rp.final_mockup}`} alt={rp.nom} />
                            <h3>{rp.nom_produit}</h3>
                            <p>{rp.prix} MAD</p>
                            <Link to={`/produits/${rp.id}`} className="btn">View Details</Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default ProductDetail;