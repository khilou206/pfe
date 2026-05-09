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
import SuccessPage from './Pages/SuccessPage';
import CancelPage from './Pages/CancelPage';
import About from './Pages/About';
import AdminDashboard from './Pages/AdminDashboard';
import { AdminRoute, UserRoute } from './context/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/payment/success" element={<SuccessPage />} />
          <Route path="/payment/cancel" element={<CancelPage />} />
          <Route path="/product-design" element={<Design />} />
          // App.js

//==============================================================================
          <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/propos" element={<About />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/Produits" element={<Produits />} />
              <Route path="/produit/:id" element={<ProductDetails />} />
              <Route path="/panier" element={<Panier />} />  
              <Route path="/checkout" element={<Checkout />} />
                <Route element={<UserRoute />}>
                  <Route path="/profile" element={<Profile />} />  
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;