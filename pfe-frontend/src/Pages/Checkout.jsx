import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/product.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id'); // Kiy-jibo mn l-URL: ?session_id=...

    const [formData, setFormData] = useState({ city: '', zipcode: '', address: '' });
    const [panier, setPanier] = useState([]);
    const [isPaid, setIsPaid] = useState(false); // Bach n-7miw l-page
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check wach kayn session_id (Ya3ni ja mn Stripe)
        if (!sessionId) {
            alert("Accès refusé. Veuillez passer par le panier.");
            navigate('/cart');
            return;
        }

        // 2. Verifier m3a Laravel wach had l-session khalsa b-sa7
        const verifyPayment = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/verify-payment/${sessionId}`);
                if (res.data.status === 'paid') {
                    setIsPaid(true);
                    setPanier(JSON.parse(localStorage.getItem('panier')) || []);
                } else {
                    navigate('/cart');
                }
            } catch (err) {
                console.error("Erreur verification", err);
                navigate('/cart');
            }
            setLoading(false);
        };

        verifyPayment();
    }, [sessionId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderPayload = {
                ...formData,
                produits: panier.map(item => ({
                    id: item.id_produit,
                    qte: item.qte,
                    color: item.color || 'Standard'
                })),
                stripe_session_id: sessionId // Zidha bach t-khzenha f DB ila bghiti
            };

            const response = await axios.post('http://127.0.0.1:8000/api/create-commande', orderPayload);
            if (response.data.status === 'success') {
                localStorage.removeItem('panier');
                alert("Commande validée !");
                navigate('/success');
            }
        } catch (error) {
            alert("Erreur lors de l'enregistrement de la commande.");
        }
    };

    if (loading) return <div className="produitC">Vérification du paiement...</div>;
    if (!isPaid) return null;

    return (
        <main className="produitC">
            <h2 className="tag">Détails de Livraison</h2>
            <div className="container-Product" style={{ padding: '40px' }}>
                <form onSubmit={handleSubmit} className="product">
                    {/* Les inputs (City, Zip, Address) - Nfs l-code li qbel */}
                    <input name="city" placeholder="Ville" onChange={(e) => setFormData({...formData, city: e.target.value})} required className="input-style" />
                    <input name="zipcode" placeholder="Code Postal" onChange={(e) => setFormData({...formData, zipcode: e.target.value})} required className="input-style" />
                    <textarea name="address" placeholder="Adresse" onChange={(e) => setFormData({...formData, address: e.target.value})} required className="input-style" />
                    
                    <button type="submit" className="buy-now" style={{marginTop: '20px'}}>
                        Confirmer la commande
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Checkout;