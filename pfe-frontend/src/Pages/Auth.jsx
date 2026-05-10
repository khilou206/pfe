import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import '../styles/Auth.css'; 

const Auth = () => {
    const { login } = useContext(AuthContext); 
    const [isSignUp, setIsSignUp] = useState(false);
    
    const [loginData, setLoginData] = useState({ nom: "", mot_de_passe: "" });
    const [registerData, setRegisterData] = useState({ 
        nom: "", email: "", tel: "", mot_de_passe: "", mot_de_passe_confirmation: "" 
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError("");
    };

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const { nom, mot_de_passe } = loginData; 
        const res = await axios.post('http://127.0.0.1:8000/api/login', { nom, mot_de_passe });
        
        if (res.data.status === 'success') {
            const userData = res.data.user;
            login(userData, res.data.access_token);
            
            // التوجيه الذكي
            if (userData.role === 'administrateur') {
                navigate('/AdminDashboard');
            } else {
                navigate('/');
            }
        }
    } catch (err) {
        setError("Nom ou mot de passe incorrect");
    }
};
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/register', registerData);
            login(res.data.user, res.data.access_token); 
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur d'inscription.");
        }
    };

    return (
        <div className={`container ${isSignUp ? 'sign-up-mode' : ''}`}>
        
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form" onSubmit={handleLogin}>
                        <h2 className="title">Se connecter</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Nom" 
                                value={loginData.nom}
                                onChange={(e) => setLoginData({...loginData, nom: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                placeholder="Mot de passe" 
                                value={loginData.mot_de_passe}
                                onChange={(e) => setLoginData({...loginData, mot_de_passe: e.target.value})} 
                                required 
                            />
                        </div>
                        {error && !isSignUp && <div className="error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                        <input type="submit" value="Login" className="btn solid" />
                        <p className="social-text">Ou se connecter avec</p>
                        <div className="social-media">
                            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                        </div>
                    </form>

                    
                    <form className="sign-up-form" onSubmit={handleRegister}>
                        <h2 className="title">S'inscrire</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Nom d'utilisateur" value={registerData.nom} onChange={(e) => setRegisterData({...registerData, nom: e.target.value})} required />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-phone"></i>
                            <input type="text" placeholder="Téléphone" value={registerData.tel} onChange={(e) => setRegisterData({...registerData, tel: e.target.value})} />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Mot de passe" value={registerData.mot_de_passe} onChange={(e) => setRegisterData({...registerData, mot_de_passe: e.target.value})} required />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Confirmer" value={registerData.mot_de_passe_confirmation} onChange={(e) => setRegisterData({...registerData, mot_de_passe_confirmation: e.target.value})} required />
                        </div>
                        {error && isSignUp && <div className="error" style={{color: 'voilet', marginBottom: '10px'}}>{error}</div>}
                        <input type="submit" className="btn" value="S'inscrire" />
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Nouveau ici ?</h3>
                        <p>Inscrivez-vous pour découvrir nos produits personnalisés.</p>
                        <button className="btn transparent" onClick={toggleMode}>S'inscrire</button>
                        <button type="button" className="btn" style={{ backgroundColor: 'voilet',margin:'10px'  }} onClick={() => navigate('/')}>Annuler</button>
                    </div>
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Déjà membre ?</h3>
                        <p>Connectez-vous pour accéder à votre espace personnel.</p>
                        <button className="btn transparent" onClick={toggleMode}>Se connecter</button>
                        <button type="button" className="btn" style={{ backgroundColor: 'voilet',margin:'10px'  }} onClick={() => navigate('/')}>Annuler</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;