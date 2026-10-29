import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import SmoothScroll from '../motion/SmoothScroll';
import Preloader from '../motion/Preloader';
import Cursor from '../motion/Cursor';

const Layout = () => (
  <div className="site-wrapper">
    <SmoothScroll />
    <Preloader />
    <Cursor />
    <Header />
    <Outlet />
    <Footer />
    <CartDrawer />
  </div>
);

export default Layout;
