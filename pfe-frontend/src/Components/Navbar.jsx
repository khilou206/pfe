import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon, LogOut } from 'lucide-react';
import '../styles/Header.css';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className={`creative-header ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src='imgs/about/logo.png' alt='logo' style={{ width: '140px', height: '130px'}}/>
        
      </Link>

      <nav style={{ display: 'flex', gap: '2.5rem' }}>
        {['/', '/produits', '/propos', '/upload'].map((path) => (
          <Link key={path} to={path} className={`nav-link ${location.pathname === path ? 'active' : ''}`}>
            {path === '/' ? 'Accueil' : path.replace('/', '').replace('propos', 'À Propos').replace('upload', 'UP Design')}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex' }}>
          {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
        </button>

        <Search size={20} style={{ cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setIsSearchOpen(!isSearchOpen)} />
        
        <Link to="/panier" style={{ color: 'var(--text-main)', position: 'relative' }}>
          <ShoppingBag size={20} strokeWidth={1.5} />
        </Link>

        {!user ? (
          <Link to="/login" className="btn-creative" style={{ padding: '8px 18px', fontSize: '0.75rem' }}>Login</Link>
        ) : (
          <div className="user-badge">
            <Link to="/profile">
                <img src="/imgs/login.png" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1.5px solid #facc15' }} alt="User" />
            </Link>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.nom}</span>
            <LogOut size={16} onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--text-dim)', marginLeft: '4px' }} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;