
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/Layout';
import { CartProvider } from './context/CartContext';

// Public Pages
import Catalog from './pages/shop/Catalog';
import Checkout from './pages/shop/Checkout';
import Login from './pages/shop/Login'; // Necesitarás este

// Admin Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';

const App: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      {isAdmin ? (
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            {/* Agrega aquí el resto de módulos de admin */}
          </Routes>
        </AdminLayout>
      ) : (
        <PublicLayout>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Checkout />} /> {/* O una página dedicada de Cart */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </PublicLayout>
      )}
    </CartProvider>
  );
};

export default App;
