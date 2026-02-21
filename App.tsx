
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/Layout';
import { CartProvider } from './context/CartContext';

// Public Pages
import Catalog from './pages/shop/Catalog';
import Checkout from './pages/shop/Checkout';
import Login from './pages/shop/Login'; // Necesitarás este
import Register from './pages/shop/Register';
import Profile from './pages/shop/Profile';
import EditProfile from './pages/shop/EditProfile';
import ProductDetail from './pages/shop/ProductDetail';
import SearchResults from './pages/shop/SerachResults';
import Cart from './pages/shop/Cart';
import OrdersPage from './pages/shop/OrdersPage';
import OrderDetailPage from './pages/shop/OrderDetailPage';
import BillsPage from './pages/shop/BillsPage';
import BillDetailPage from './pages/shop/BillDetailPage';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Bills from './pages/Bills';


const App: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdmin ? (
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/bills" element={<Bills />} />
          </Routes>
        </AdminLayout>
      ) : (
        <PublicLayout>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/productDetail/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/bills/:id" element={<BillDetailPage />} />
          </Routes>
        </PublicLayout>
      )}
    </>
  );
};

export default App;
/* <Route path="/bills/:id" element={<BillDetailPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />

*/