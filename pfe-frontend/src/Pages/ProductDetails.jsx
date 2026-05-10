import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/DetailsProduit.css';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate =useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
    const item = {
        id: product.id,
        nom_produit: product.nom_produit, 
        prix: product.prix,
        image: product.final_mockup, 
        qte: product.qte
    };
    addToCart(item);
    alert(`Produit ajouté: ${product.nom_produit}`);
    navigate('/panier')
};

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/product/${id}/`);
                setProduct(response.data);
                setSelectedImage(response.data.final_mockup);
                setLoading(false);
            } catch (error) {
                console.error("Erreur f fetching data:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading">Chargement en cours...</div>;
    if (!product) return <div className="error">Produit introuvable!</div>;

    const base_url = "http://127.0.0.1:8000";

    return (
        <div className="product-details-page">
            
            {/* --- SECTIONS T-TSAWER --- */}
            <div className="images-container">
                <div className="main-image-wrapper">
                    <img 
                        src={`${base_url}${selectedImage}`} 
                        alt={product.nom_produit} 
                    />
                </div>
                
                <div className="thumbnails-list">
                    {/* Thumbnail dial l-image principal */}
                    <div 
                        className={`thumb-item ${selectedImage === product.final_mockup ? 'active' : ''}`}
                        onClick={() => setSelectedImage(product.final_mockup)}
                    >
                        <img src={`${base_url}${product.final_mockup}`} alt="thumb" />
                    </div>

                    {/* Ila 3ndek t-tsawer khrin f l-backend (Gallery) */}
                    {product.images?.map((img, index) => (
                        <div 
                            key={index} 
                            className={`thumb-item ${selectedImage === img.image ? 'active' : ''}`}
                            onClick={() => setSelectedImage(img.image)}
                        >
                            <img src={`${base_url}${img.image}`} alt={`thumb-${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SECTION L-MA3LOUMAT --- */}
            <div className="product-info">
                <span className="category-tag">{product.categorie_nom || 'Product'}</span>
                <h1 className="product-title">{product.nom_produit}</h1>
                
                <div className="product-price">{product.prix} MAD</div>
                <div className="reviews">
                    <span style={{ color: '#ffb400' }}>★★★★★</span> 
                    <span style={{ color: '#888', marginLeft: '10px' }}>(47 Reviews)</span>
                </div>

                {/* Selection Size */}
                <div className="selection-group">
                    <h4>Size</h4>
                    <div className="size-options">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button key={size} className="size-btn">{size}</button>
                        ))}
                    </div>
                </div>

                <div className="quantity-control">
                    <button className="q-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span className="q-value">{quantity}</span>
                    <button className="q-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <div className="actions-btns">
                    <button className="buy-now" onClick={() => handleAddToCart(product)}>+ Add to Cart</button>
                    <Link className="add-to-cart" >retour</Link>
                </div>
            </div>

        </div>
    );
};

export default ProductDetails;