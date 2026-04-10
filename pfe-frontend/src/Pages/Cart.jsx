import React from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Khdem b l-Public Key dyalk
const stripePromise = loadStripe('pk_test_your_public_key_here');

const Cart = () => {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];

    const handlePayment = async () => {
        try {
            // 1. Appel l Laravel bach t-creer Session
            const response = await axios.post('http://127.0.0.1:8000/api/payment', panier);
            const sessionId = response.data.id;

            // 2. Redirect l Stripe Checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (error) console.error(error);

        } catch (err) {
            console.error("Erreur de paiement", err);
        }
    };

    return (
        <main className="produitC">
            <h2 className="tag">Votre Panier</h2>
            <div className="container-Product" style={{display: 'block', padding: '40px'}}>
                {panier.length > 0 ? (
                    <>
                        {/* List products hna... */}
                        <button onClick={handlePayment} className="buy-now" style={{width: '100%'}}>
                            Procéder au Paiement (Stripe)
                        </button>
                    </>
                ) : (
                    <p>Panier vide</p>
                )}
            </div>
        </main>
    );
};

export default Cart;