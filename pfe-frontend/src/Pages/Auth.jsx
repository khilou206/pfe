import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // تأكد أن هاد الملف فيه الـ CSS اللي حطيتي لي

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginData, setLoginData] = useState({ nom: "", mot_de_passe: "" });
    const [registerData, setRegisterData] = useState({ nom: "", email: "", mot_de_passe: "", mot_de_passe_confirmation: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // التبديل بين الـ Sign In والـ Sign Up
    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(""); // مسح الخطأ فاش كنبدلو الفورم
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', loginData);
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // الرجوع للصفحة اللي كان فيها المستعمل أو الـ Accueil
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError("Nom ou mot de passe incorrect");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerData.mot_de_passe !== registerData.mot_de_passe_confirmation) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/register', registerData);
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError("Erreur d'inscription. Nom ou Email déjà utilisé.");
        }
    };

    return (
        /* هنا كنعيطو لـ "sign-up-mode" ملي كتكون isSignUp true باش تبدا الـ Animation ديال الـ CSS */
        <div className={`container ${isSignUp ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    
                    {/* --- Login Form --- */}
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
                        {error && !isSignUp && <div className="error">{error}</div>}
                        <input type="submit" value="Login" className="btn solid" />
                        
                        <p className="social-text">Ou se connecter avec</p>
                        <div className="social-media">
                            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                        </div>
                    </form>

                    {/* --- Register Form --- */}
                    <form className="sign-up-form" onSubmit={handleRegister}>
                        <h2 className="title">S'inscrire</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Nom d'utilisateur" 
                                value={registerData.nom}
                                onChange={(e) => setRegisterData({...registerData, nom: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={registerData.email}
                                onChange={(e) => setRegisterData({...registerData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                placeholder="Mot de passe" 
                                value={registerData.mot_de_passe}
                                onChange={(e) => setRegisterData({...registerData, mot_de_passe: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                placeholder="Confirmer mot de passe" 
                                value={registerData.mot_de_passe_confirmation}
                                onChange={(e) => setRegisterData({...registerData, mot_de_passe_confirmation: e.target.value})} 
                                required 
                            />
                        </div>
                        {error && isSignUp && <div className="error">{error}</div>}
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
                    </div>
                    <img src="/imgs/log.svg" className="image" alt="Login Illustration" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Déjà membre ?</h3>
                        <p>Connectez-vous pour accéder à votre espace personnel.</p>
                        <button className="btn transparent" onClick={toggleMode}>Se connecter</button>
                    </div>
                    <img src="/imgs/register.svg" className="image" alt="Register Illustration" />
                </div>
            </div>
        </div>
    );
};

export default Auth;