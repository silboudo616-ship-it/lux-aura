import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SmoothScroll from '../motion/SmoothScroll';

const Layout = () => (
  <div className="site-wrapper">
    <SmoothScroll />
    <Header />
    <Outlet />
    <Footer />
    <CartDrawer />
  </div>
);

export default Layout;
