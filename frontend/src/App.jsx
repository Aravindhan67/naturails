import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { AdminNavbar } from './components/AdminNavbar';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { AdminRoute } from './components/AdminRoute';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserOrdersPage } from './pages/UserOrdersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

function AppLayout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdminDashboard = location.pathname === '/admin';

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isAdminPath ? 'bg-earth-50' : 'bg-cream-light'
      } text-botanical-900 font-sans`}
    >
      {/* Show Admin Header ONLY on Admin side; regular store header on customer pages */}
      {isAdminPath ? (
        isAdminDashboard && <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public & Customer Store Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/track" element={<OrderTrackingPage />} />
          <Route path="/my-orders" element={<UserOrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Dedicated Administrator Gateway */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Strictly Guarded Admin Operations Center */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {/* Remove customer footer & cart toast from Admin side */}
      {!isAdminPath && <Footer />}
      {!isAdminPath && <NotificationToast />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
