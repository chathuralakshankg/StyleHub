import React from 'react';
import { Row, Col, Button, Table } from 'antd';
import { Upload, Plus, Filter, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  // Placeholder data
  const recentOrders = [
    { key: '1', id: '#ORD-001', customer: 'Dinithi Fernando', address: 'Horton Gardens, Colombo 07', status: 'Completed', amount: '120,000.00' },
    { key: '2', id: '#ORD-002', customer: 'Jane Smith', address: 'Lighthouse Street, Galle Fort', status: 'Processing', amount: '450,000.00' },
    { key: '3', id: '#ORD-003', customer: 'Alex Johnson', address: 'Hotel Road, Mount Lavinia', status: 'Pending', amount: '85,000.00' },
    { key: '4', id: '#ORD-004', customer: 'Sarah Williams', address: 'Kollupitiya, Colombo 03', status: 'Completed', amount: '320,000.00' },
    { key: '5', id: '#ORD-005', customer: 'Kasun Perera', address: 'Hillwood Drive, Kandy', status: 'Processing', amount: '195,000.00' },
  ];

  const renderStatus = (status) => {
    if (status === 'Completed') return <span className="badge-green"><span className="w-1.5 h-1.5 rounded-full bg-[#048b56] inline-block mr-1.5"></span>Completed</span>;
    if (status === 'Processing') return <span className="badge-yellow"><span className="w-1.5 h-1.5 rounded-full bg-[#b7790b] inline-block mr-1.5"></span>Processing</span>;
    if (status === 'Pending') return <span className="badge-gray"><span className="w-1.5 h-1.5 rounded-full bg-[#8c8c8c] inline-block mr-1.5"></span>Pending</span>;
  };

  const columns = [
    { 
      title: 'Order ID', 
      dataIndex: 'id', 
      key: 'id',
      render: text => <span className="font-bold text-xs">{text}</span>
    },
    { 
      title: 'Customer', 
      key: 'customer',
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.customer}</div>
          <div className="text-xs text-gray-400 mt-0.5">{record.address}</div>
        </div>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => renderStatus(status)
    },
    { 
      title: 'Amount (LKR)', 
      dataIndex: 'amount', 
      key: 'amount',
      render: amount => <span className="text-xs font-mono font-medium">Rs. {amount}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <button className="text-xs text-gray-400 hover:text-black transition-colors">Inspect</button>
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Title & Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#111] mb-2">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin. Here is the daily summary for StyleHub Sri Lanka & islandwide orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<Upload size={16} />} className="flex items-center text-sm font-medium h-10 px-4 rounded-md border-gray-200">
            Export Ledger
          </Button>
          <Button type="primary" icon={<Plus size={16} />} className="flex items-center bg-[#111] hover:bg-[#333] h-10 px-4 text-sm font-medium rounded-md">
            New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-6 admin-stat-card h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-medium text-gray-500 tracking-wider">TOTAL REVENUE</span>
                <span className="bg-[#e6f7ee] text-[#048b56] text-[10px] font-bold px-2 py-0.5 rounded">+14.2%</span>
              </div>
              <div className="text-xl font-serif text-gray-900 leading-tight">Rs.</div>
              <div className="text-4xl font-serif text-gray-900 tracking-tight">12,450,000</div>
            </div>
            <div className="text-xs text-gray-400 mt-4">Prev. Month: Rs. 10.9M LKR</div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-6 admin-stat-card h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-medium text-gray-500 tracking-wider">TOTAL ORDERS</span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded">This Month</span>
              </div>
              <div className="text-4xl font-serif text-gray-900 tracking-tight mb-2">324</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
              <span className="w-1.5 h-1.5 bg-[#b7790b] rounded-full"></span>
              18 orders pending fulfillment
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-6 admin-stat-card h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-medium text-gray-500 tracking-wider w-1/2">TOTAL PRODUCTS</span>
                <span className="bg-[#fcf5e8] text-[#b7790b] text-[10px] font-medium px-2 py-0.5 rounded text-right">Silk &<br/>Handloom</span>
              </div>
              <div className="text-4xl font-serif text-gray-900 tracking-tight">86</div>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-4">
              <span className="text-gray-400">Active<br/>items:</span>
              <span className="text-gray-500">82 in stock, 4<br/>backorder</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-6 admin-stat-card h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-medium text-gray-500 tracking-wider">TOTAL USERS</span>
                <span className="bg-[#e6f7ee] text-[#048b56] text-[10px] font-bold px-2 py-0.5 rounded">+88 Patrons</span>
              </div>
              <div className="text-4xl font-serif text-gray-900 tracking-tight mb-2">1,204</div>
            </div>
            <div className="text-xs text-gray-500 mt-4">Tier: 142 Haute Couture VIPs</div>
          </div>
        </Col>
      </Row>

      {/* Orders Table */}
      <div className="bg-white admin-table-card admin-table">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif text-gray-900 mb-1">Recent Orders</h2>
            <p className="text-xs text-gray-400">Live transaction ledger across Akuressa main branch and islandwide deliveries</p>
          </div>
          <div className="flex items-center gap-4">
            <Button icon={<Filter size={14} />} className="text-xs flex items-center h-8 rounded border-gray-200">
              Filter Status
            </Button>
            <button className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:text-gray-500 transition-colors">
              View All Orders <ArrowRight size={14} />
            </button>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={recentOrders} 
          pagination={false}
        />

        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-[#faf9f7]">
          <span className="text-xs text-gray-500">Showing 5 of 324 total orders registered this fiscal cycle</span>
          <div className="flex items-center gap-2">
            <Button size="small" className="text-xs h-7 rounded border-gray-200" disabled>Previous</Button>
            <span className="text-xs font-medium mx-2">Page 1 of 65</span>
            <Button size="small" className="text-xs h-7 rounded border-gray-200">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
