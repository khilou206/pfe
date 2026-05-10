import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('pmn_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    useEffect(() => {
        localStorage.setItem('pmn_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const exists = prevCart.find(item => item.id === product.id);
            if (exists) {
                return prevCart.map(item => 
                    item.id === product.id ? { ...item, qte: (item.qte || 1) + 1 } : item
                );
            }
            return [...prevCart, { ...product, qte: 1 }];
        });
    };
    const removeItem = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };
    const updateQty = (id, val) => {
        const newQty = Math.max(1, parseInt(val) || 1);
        setCart(prevCart => 
            prevCart.map(item => item.id === id ? { ...item, qte: newQty } : item)
        );
    };
    const total = cart.reduce((acc, item) => acc + (Number(item.prix) * (item.qte || 1)), 0);
    return (
        <CartContext.Provider value={{ cart, addToCart, removeItem, updateQty, total, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);