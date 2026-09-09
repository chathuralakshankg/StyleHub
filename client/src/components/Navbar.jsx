import React, { useState, useEffect, useContext } from 'react';
import { Layout, Badge } from 'antd';
import { Search, User, ShoppingBag, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './Auth';
import { AuthContext } from '../context/AuthContext';

const { Header } = Layout;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <Header 
        className={`sticky top-0 z-50 w-full px-6 lg:px-16 transition-all duration-300 ease-in-out border-b ${
          scrolled ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm py-4' : 'bg-white border-transparent py-6'
        }`}
        style={{ height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Left Side: Logo + Nav Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="text-2xl font-serif tracking-widest cursor-pointer uppercase">
            StyleHub
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-800">
            <Link to="/" className="hover:text-black transition-colors py-4">Home</Link>
            
            <div className="relative group cursor-pointer py-4">
              <Link to="/collections/menswear" className="flex items-center gap-1 hover:text-black transition-colors">Men's <ChevronDown size={16} /></Link>
              <div className="absolute left-0 top-full mt-0 w-48 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                {['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Shorts', 'Sarongs'].map(item => (
                  <Link key={item} to={`/collections/menswear?sub=${encodeURIComponent(item)}`} className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50">{item}</Link>
                ))}
              </div>
            </div>

            <div className="relative group cursor-pointer py-4">
              <Link to="/collections/womenswear" className="flex items-center gap-1 hover:text-black transition-colors">Womens <ChevronDown size={16} /></Link>
              <div className="absolute left-0 top-full mt-0 w-52 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                {['Blouses & Tops', 'Dresses', 'Frocks', 'Skirts', 'Trousers/Jeans', 'Sarees'].map(item => (
                  <Link key={item} to={`/collections/womenswear?sub=${encodeURIComponent(item)}`} className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50">{item}</Link>
                ))}
              </div>
            </div>

            <div className="relative group cursor-pointer py-4">
              <Link to="/collections/accessories" className="flex items-center gap-1 hover:text-black transition-colors">Accessories <ChevronDown size={16} /></Link>
              <div className="absolute left-0 top-full mt-0 w-48 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 z-50">
                {['Ties', 'Belts', 'Vests', 'Socks'].map(item => (
                  <Link key={item} to={`/collections/accessories?sub=${encodeURIComponent(item)}`} className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50">{item}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="text-gray-900 hover:text-gray-500 transition-colors"><Search size={18} strokeWidth={1.5} /></button>
          
          {user ? (
            <div className="flex items-center gap-5">
              {['developer', 'owner', 'inventory_handler', 'sales_staff'].includes(user.role) && (
                <Link to="/admin/dashboard" className="text-gray-900 hover:text-gray-500 transition-colors" title="Admin Dashboard">
                  <LayoutDashboard size={18} strokeWidth={1.5} />
                </Link>
              )}
              <div className="relative group cursor-pointer pt-2 pb-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif font-bold text-xs hover:bg-gray-800 transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute right-0 top-full mt-0 w-32 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-50">
                  <span className="text-xs font-semibold px-2 py-1 mb-1 border-b border-gray-100">Hi, {user.name.split(' ')[0]}</span>
                  <Link to="/profile" className="text-xs text-left text-gray-700 hover:bg-gray-50 px-2 py-1.5 flex items-center gap-2 mt-1">
                    <User size={14} /> Profile
                  </Link>
                  <button onClick={logout} className="text-xs text-left text-red-600 hover:bg-gray-50 px-2 py-1.5 flex items-center gap-2">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <User size={16} strokeWidth={2} />
            </button>
          )}

          <button className="text-gray-900 hover:text-gray-500 transition-colors relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-black rounded-full border-2 border-white"></div>
          </button>
        </div>
      </Header>
    </>
  );
};

export default Navbar;
