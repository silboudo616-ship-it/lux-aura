import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Product from './pages/Product';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Admin from './pages/Admin';

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <BrowserRouter basename="/luxaura/">
          <Routes>
            {/* Admin — standalone layout (no header/footer) */}
            <Route path="/admin/*" element={<Admin />} />

            {/* Public site */}
            <Route path="/" element={<Layout />}>
              <Route index           element={<Home />} />
              <Route path="collections"   element={<Collections />} />
              <Route path="produit/:id"   element={<Product />} />
              <Route path="connexion"     element={<Auth />} />
              <Route path="compte/*"      element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
