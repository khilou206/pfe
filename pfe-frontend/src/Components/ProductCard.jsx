import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    
    const mainImage = product.images?.[0]?.nom_image || 'default.png';

    return (
        <div className="pro">
            <Link to={`/product/${product.id_product}`}>
                <img src={`/imgs/${mainImage}`} alt={product.nom_produit} />
            </Link>
            
            <div className="des">
                <span>{product.categorie_produit}</span>
                <Link to={`/product/${product.id_product}`}>
                    <h5>{product.nom_produit}</h5>
                </Link>
                <div className="star">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                </div>
                <h4>{product.prix} MAD</h4>
            </div>
            <button 
                className="cart" 
                onClick={(e) => onAddToCart(e, product)}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-cart-shopping"></i>
            </button>
        </div>
    );
};

export default ProductCard;