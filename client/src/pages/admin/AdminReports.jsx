import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Spin, message, Select } from 'antd';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';

const { Option } = Select;

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all'); // all, month, week

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        message.error('Failed to fetch orders data');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on dateRange
  const getFilteredOrders = () => {
    if (dateRange === 'all') return orders;
    
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateRange === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();
  
  // Exclude cancelled/failed orders for revenue metrics
  const successfulOrders = filteredOrders.filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus !== 'Failed' && o.paymentStatus !== 'Returned');

  // Metrics
  const totalRevenue = successfulOrders.reduce((acc, order) => acc + order.totalPrice, 0);
  const pendingTotal = filteredOrders.filter(o => o.paymentStatus === 'Pending').reduce((acc, order) => acc + order.totalPrice, 0);
  const paidTotal = filteredOrders.filter(o => o.paymentStatus === 'Paid').reduce((acc, order) => acc + order.totalPrice, 0);

  const totalOrdersCount = filteredOrders.length;
  const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  const totalItemsSold = successfulOrders.reduce((acc, order) => {
    return acc + order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  // Revenue Trend Data (Daily)
  const revenueTrendMap = {};
  successfulOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!revenueTrendMap[date]) revenueTrendMap[date] = 0;
    revenueTrendMap[date] += order.totalPrice;
  });
  const revenueTrendData = Object.keys(revenueTrendMap).reverse().map(date => ({
    date,
    revenue: revenueTrendMap[date]
  }));

  // Sales by Category
  const categoryMap = {};
  successfulOrders.forEach(order => {
    order.orderItems.forEach(item => {
      // product could be null if deleted, fallback to 'Uncategorized'
      const category = item.product?.category || 'Uncategorized';
      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += item.quantity;
    });
  });
  const categoryData = Object.keys(categoryMap).map(category => ({
    name: category,
    sales: categoryMap[category]
  })).sort((a, b) => b.sales - a.sales);

  // Top Selling Products
  const productMap = {};
  successfulOrders.forEach(order => {
    order.orderItems.forEach(item => {
      if (!productMap[item.name]) productMap[item.name] = 0;
      productMap[item.name] += item.quantity;
    });
  });
  const topProductsData = Object.keys(productMap)
    .map(name => ({ name, sales: productMap[name] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5); // Top 5

  // Payment Method Data
  const methodMap = { 'Card Payment': 0, 'Cash on Delivery': 0 };
  filteredOrders.forEach(order => {
    if (methodMap[order.paymentMethod] !== undefined) {
      methodMap[order.paymentMethod] += 1;
    }
  });
  const paymentMethodData = [
    { name: 'Card Payment', value: methodMap['Card Payment'] },
    { name: 'Cash on Delivery', value: methodMap['Cash on Delivery'] }
  ];

  // Payment Status Data
  const statusMap = { 'Paid': 0, 'Pending': 0, 'Failed': 0, 'Returned': 0 };
  filteredOrders.forEach(order => {
    if (statusMap[order.paymentStatus] !== undefined) {
      statusMap[order.paymentStatus] += 1;
    }
  });
  const paymentStatusData = [
    { name: 'Paid', value: statusMap['Paid'] },
    { name: 'Pending', value: statusMap['Pending'] },
    { name: 'Failed', value: statusMap['Failed'] },
    { name: 'Returned', value: statusMap['Returned'] }
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']; // Emerald, Amber, Red, Blue

  // Table Columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span className="font-mono text-xs">#{id.slice(-8).toUpperCase()}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => record.shippingDetails.firstName + ' ' + record.shippingDetails.lastName
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <span className="text-xs text-gray-500">{method}</span>
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status === 'Paid' ? 'bg-green-50 text-green-700' : status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : status === 'Returned' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
          {status}
        </span>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span className="font-bold">LKR {price.toLocaleString()}</span>,
      align: 'right'
    }
  ];

  if (loading) return <div className="py-20 flex justify-center"><Spin size="large" /></div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Payments & Sales Reports</h1>
          <p className="text-gray-500 text-sm">Comprehensive overview of revenue, sales trends, and payment performance.</p>
        </div>
        <Select value={dateRange} onChange={setDateRange} style={{ width: 150 }} className="rounded">
          <Option value="all">All Time</Option>
          <Option value="month">This Month</Option>
          <Option value="week">Past 7 Days</Option>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-serif font-bold text-gray-900">LKR {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Paid Total</p>
            <p className="text-2xl font-serif font-bold text-gray-900">LKR {paidTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pending Total</p>
            <p className="text-2xl font-serif font-bold text-gray-900">LKR {pendingTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Avg. Order Value</p>
            <p className="text-2xl font-serif font-bold text-gray-900">LKR {Math.round(aov).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Items Sold</p>
            <p className="text-2xl font-serif font-bold text-gray-900">{totalItemsSold}</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `Rs.${val/1000}k`} dx={-10} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#333', fontWeight: 500 }} width={100} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProductsData.map((prod, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate w-40" title={prod.name}>{prod.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{prod.sales} sold</span>
              </div>
            ))}
            {topProductsData.length === 0 && <p className="text-gray-400 text-sm">No data available</p>}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#111" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Statuses */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-6">Payment Status Breakdown</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-serif text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="_id" 
          pagination={{ pageSize: 5 }}
        />
      </div>

    </div>
  );
};

export default AdminReports;
