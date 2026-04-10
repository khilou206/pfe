import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/recherche.css';
import '../styles/style3.css';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <header id="header" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '30px 120px', 
            // Hadu homa l-isla7at l-wa7ida f style:
            background: isHomePage ? 'transparent' : '#2e1e6b', 
            position: 'fixed', 
            width: '100%',
            top: 0, 
            left: 0,
            zIndex: 1000,
            transition: '0.3s'
        }}>
            <Link to="/">
                <img src="/imgs/print.png" style={{ width: "200px" }} alt="Logo" />
            </Link>

            <ul id="navbar" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0 }}>
                <li><Link className={location.pathname === '/' ? 'active' : ''} to="/" style={{ color: '#fff', padding: '0 15px' }}>Accueil</Link></li>
                <li><Link className={location.pathname === '/produits' ? 'active' : ''} to="/produits" style={{ color: '#fff', padding: '0 15px' }}>Produits</Link></li>
                <li><Link className={location.pathname === '/propos' ? 'active' : ''} to="/propos" style={{ color: '#fff', padding: '0 15px' }}>A propos</Link></li>
                <li><Link className={location.pathname === '/upload' ? 'active' : ''} to="/upload" style={{ color: '#fff', padding: '0 15px' }}>UP Design</Link></li>
                
                {/* Basket */}
                <li style={{ padding: '0 15px' }}>
                    <Link to="/panier">
                        <i className="fa-solid fa-basket-shopping" style={{ color: "#e4b946", fontSize: '20px' }}></i>
                    </Link>
                </li>

                {/* Search Dropdown - Style l-9dim dyalk */}
                <li className="dropdown" style={{ padding: '0 10px' }}>
                    <button className="dropbtn" onClick={(e) => {e.preventDefault(); setIsSearchOpen(!isSearchOpen)}} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#e4b946", fontSize: '20px' }}></i>
                    </button>
                    <div className={`dropdown-content ${isSearchOpen ? 'show' : ''}`} style={{ right: '0px' }}>
                        <form onSubmit={(e) => { e.preventDefault(); navigate(`/search?query=${searchTerm}`); setIsSearchOpen(false); }}>
                            <input 
                                type="text" 
                                placeholder="Search.." 
                                id="myInput" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        <Link to="/produits?category=t-shirt">T-SHIRT</Link>
                        <Link to="/produits?category=chaier">CHAIER</Link>
                        <Link to="/produits?category=sweatshirt">SWEATSHIRT</Link>
                    </div>
                </li>

                {/* Auth Logic */}
                {!user ? (
                    <li style={{ padding: '0 15px' }}>
                        <Link to="/login" style={{ color: '#fff', fontWeight: 'bold' }}>Login</Link>
                    </li>
                ) : (
                    <li style={{ padding: '0 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/profile">
                            <img src="/imgs/login.png" style={{ width: "30px", borderRadius: '50%' }} alt="User" />
                        </Link>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{user.nom}</span>
                        <a href="#" onClick={handleLogout} style={{ color: '#fff', marginLeft: '10px' }}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </a>
                    </li>
                )}
            </ul>
        </header>
    );
};

export default Navbar;