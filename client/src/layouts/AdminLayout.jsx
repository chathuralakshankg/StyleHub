import React, { useContext, useState } from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings,
  LogOut,
  Menu as MenuIcon,
  Home,
  Bell,
  ShoppingBag,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Admin.css'; // Import custom styles

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allMenuItems = [
    {
      key: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
      roles: ['developer', 'owner', 'inventory_handler', 'sales_staff']
    },
    {
      key: '/admin/users',
      icon: <Users size={18} />,
      label: 'Customer & Staff Management',
      roles: ['developer', 'owner']
    },
    {
      key: '/admin/products',
      icon: <Package size={18} />,
      label: 'Product & Stock Management',
      roles: ['developer', 'owner', 'inventory_handler']
    },
    {
      key: '/admin/orders',
      icon: <ShoppingBag size={18} />,
      label: 'Order Management',
      roles: ['developer', 'owner', 'sales_staff']
    },
    {
      key: '/admin/payments',
      icon: <CreditCard size={18} />,
      label: 'Payments & Sales Reports',
      roles: ['developer', 'owner', 'sales_staff']
    },
    {
      key: '/admin/tickets',
      icon: <MessageSquare size={18} />,
      label: 'Support Tickets',
      roles: ['developer', 'owner', 'sales_staff']
    },
    {
      key: 'divider',
      type: 'divider',
      style: { backgroundColor: '#333' },
      roles: ['developer', 'owner', 'inventory_handler', 'sales_staff']
    },
    {
      key: '/admin/settings',
      icon: <Settings size={18} />,
      label: 'Settings',
      roles: ['developer', 'owner']
    }
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <Layout className="min-h-screen admin-layout-container" style={{ backgroundColor: '#fcfaf8' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        className="admin-sidebar"
      >
        <div className="pt-8 pb-4 px-6">
          <h1 className={`text-[#d4af37] text-[10px] tracking-widest font-bold uppercase transition-all ${collapsed ? 'scale-0 hidden' : 'scale-100'}`}>
            Console • StyleHub
          </h1>
          <p className={`text-gray-400 text-xs mt-1 transition-all ${collapsed ? 'hidden' : 'block'}`}>
            Management Portal
          </p>
          <div className={`text-[#d4af37] text-xl font-serif font-bold text-center transition-all ${!collapsed ? 'scale-0 hidden' : 'scale-100'}`}>
            A.
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          className="mt-4"
        />

        {!collapsed && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
              <span className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase">Flagship Store</span>
            </div>
            <p className="text-gray-400 text-xs italic font-serif">Akuressa, Matara</p>
            <p className="text-gray-500 text-[10px]">Sri Lanka • GMT+5:30</p>
          </div>
        )}
      </Sider>
      
      <Layout style={{ backgroundColor: '#fcfaf8' }}>
        <Header 
          className="flex items-center justify-between px-6 bg-white border-b border-gray-200"
          style={{ height: '72px', padding: '0 24px' }}
        >
          <div className="flex items-center gap-6">
            <Button
              type="text"
              icon={<MenuIcon size={20} />}
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-black"
            />
            
            {/* Logo Area */}
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-serif tracking-widest uppercase font-bold m-0">StyleHub</h2>
              <span className="text-[#d4af37] text-[10px] tracking-widest font-bold uppercase">Sri Lanka</span>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-500">Akuressa Main Branch & Islandwide Delivery</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
              <Home size={16} />
              <span className="text-xs font-medium">Live Storefront</span>
            </Link>
            
            <button className="text-gray-400 hover:text-black transition-colors relative">
              <Bell size={18} />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            </button>

            <div className="w-px h-6 bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <Avatar size={36} className="bg-[#333] font-serif font-bold text-white">AD</Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-tight">Admin Area</span>
                <span className="text-[10px] text-gray-500 leading-tight">
                  {user?.name || 'Genevieve D. (Director)'}
                </span>
              </div>
            </div>

            <Button 
              type="text" 
              icon={<LogOut size={16} />} 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <span className="text-xs font-medium">Logout</span>
            </Button>
          </div>
        </Header>
        
        <Content className="p-8">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
