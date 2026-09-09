import React from 'react'; // Trigger Vite HMR
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import Home from './pages/Home';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminTickets from './pages/admin/AdminTickets';
import Profile from './pages/Profile';

import Collections from './pages/Collections';

const THEME = {
  token: {
    colorPrimary: '#000000',
    fontFamily: '"Inter", sans-serif',
    borderRadius: 2,
    colorTextHeading: '#111',
  },
  components: {
    Button: {
      colorPrimary: '#000000',
      colorPrimaryHover: '#333333',
      colorPrimaryActive: '#000000',
      primaryShadow: 'none',
    },
    Card: {
      paddingLG: 16,
    },
    Slider: {
      handleColor: '#000000',
      handleActiveColor: '#000000',
      trackBg: '#000000',
      trackHoverBg: '#000000',
      dotBorderColor: '#000000',
      dotActiveBorderColor: '#000000',
      handleLineWidth: 2,
      handleLineWidthHover: 2,
    }
  }
};

export default function App() {
  return (
    <ConfigProvider theme={THEME}>
      <Layout className="min-h-screen bg-white">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:categoryId" element={<Collections />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="tickets" element={<AdminTickets />} />
                <Route path="settings" element={<div className="p-8">Settings Page Coming Soon</div>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </Layout>
    </ConfigProvider>
  );
}
