// Pages/SuccessPage.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const { token } = useContext(AuthContext);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId && token) {
        
            axios.get(`http://127.0.0.1:8000/api/verify-payment/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => console.log("Payment Verified in DB"))
            .catch(err => console.error("Verification error", err));
        }
    }, [sessionId, token]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1 style={{ color: 'green' }}>Payment Successful! 🎉</h1>
<p>Thank you for your trust. Your order has been recorded and is being processed.</p>
<Link to="/profile" className="btn">View My Orders</Link>
        </div>
    );
};

export default SuccessPage;