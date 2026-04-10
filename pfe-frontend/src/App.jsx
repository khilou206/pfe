import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'

import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import ProductDetails from './Pages/ProductDetails';
import Auth from './Pages/Auth';
import SearchPage from './Pages/SearchPage';
import Panier from './Pages/Panier';
import Produits from './Pages/Produits';
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';

function App() {
  // Fonction bach n-zidu produit l-panier (Local Storage)
const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id_produit === product.id_produit);
    
    if (index !== -1) {
        cart[index].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Produit ajouté au panier !");
};

  return (
    <BrowserRouter>
      <Navbar user={null} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/produits" element={<Produits addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Profile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
