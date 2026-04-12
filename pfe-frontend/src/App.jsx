import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import { AuthProvider } from './context/AuthContext';
import Home from './Pages/Home';
import ProductDetails from './Pages/ProductDetails';
import Auth from './Pages/Auth';
import SearchPage from './Pages/SearchPage';
import Panier from './Pages/Panier';
import Produits from './Pages/Produits';
import Checkout from './Pages/Checkout';
import Profile from './Pages/Profile';
import Upload from './Pages/Upload';
import Design from './Pages/Design';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Pages li fihom layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product-design" element={<Design />} />
          <Route path="/upload" element={<Upload />} />
        </Route>

        {/* login بلا layout */}
        <Route path="/login" element={<Auth />} />

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;