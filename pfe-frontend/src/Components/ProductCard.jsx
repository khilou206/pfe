import React from 'react';
import { Link } from 'react-router-dom'; // Bach l-page mat-reloadi-ch

const ProductCard = ({ product, onAddToCart }) => {
    // 1. Kat-chouf awwal image f l-array li jay mn Laravel
    const mainImage = product.images?.[0]?.nom_image || 'default.png';

    return (
        <div className="pro">
            {/* 2. Link f blast <a> bach t-koun navigation sari3a */}
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
            
            {/* 3. L-button dyal l-panier */}
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