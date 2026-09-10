import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, message, Button, Modal, Tabs, Input } from 'antd';
import { Eye, Clock, PackageCheck, Truck, CheckCircle2, XCircle, Search } from 'lucide-react';

const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState('');

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
        message.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, type, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const payload = type === 'order' 
        ? { orderStatus: newStatus } 
        : { paymentStatus: newStatus };

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        message.success(`${type === 'order' ? 'Order' : 'Payment'} status updated successfully`);
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, ...payload } 
            : order
        ));
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('An error occurred while updating status');
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={12} />;
      case 'Processing': return <PackageCheck size={12} />;
      case 'Shipped': return <Truck size={12} />;
      case 'Delivered': return <CheckCircle2 size={12} />;
      case 'Cancelled': return <XCircle size={12} />;
      default: return null;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Processing': return 'blue';
      case 'Shipped': return 'geekblue';
      case 'Delivered': return 'green';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span className="font-medium text-gray-700">#{id.slice(-8).toUpperCase()}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.shippingDetails.firstName} {record.shippingDetails.lastName}</span>
          <span className="text-xs text-gray-500">{record.shippingDetails.email}</span>
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span className="font-bold">LKR {price.toLocaleString()}</span>,
    },
    {
      title: 'Order Status',
      key: 'orderStatus',
      render: (_, record) => (
        <Select 
          value={record.orderStatus} 
          style={{ width: 130 }}
          bordered={false}
          className="bg-gray-50 rounded"
          onChange={(val) => handleStatusChange(record._id, 'order', val)}
        >
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <Option key={status} value={status}>
              <div className="flex items-center gap-1.5 text-xs">
                <Tag color={getOrderStatusColor(status)} className="m-0 flex items-center gap-1 px-1.5 py-0.5 border-0">
                  {getOrderStatusIcon(status)}
                  {status}
                </Tag>
              </div>
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Payment Status',
      key: 'paymentStatus',
      render: (_, record) => (
        <Select 
          value={record.paymentStatus} 
          style={{ width: 100 }}
          bordered={false}
          className="bg-gray-50 rounded"
          onChange={(val) => handleStatusChange(record._id, 'payment', val)}
        >
          {(record.paymentMethod === 'Card Payment' ? ['Paid', 'Returned', 'Failed'] : ['Pending', 'Paid', 'Failed']).map(status => (
            <Option key={status} value={status}>
               <Tag color={status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : status === 'Returned' ? 'blue' : 'red'} className="m-0 border-0">
                  {status}
                </Tag>
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<Eye size={16} />} 
          onClick={() => {
            setSelectedOrder(record);
            setViewModalVisible(true);
          }}
          className="flex items-center text-gray-500 hover:text-black"
        >
          View
        </Button>
      )
    }
  ];

  const filteredOrders = orders.filter(order => 
    order._id.slice(-8).toUpperCase().includes(searchText.toUpperCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">Order Management</h1>
          <p className="text-gray-500 text-sm">Monitor, process, and track customer orders in real-time.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search Order ID..."
            prefix={<Search size={16} className="text-gray-400 mr-1" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-sm"
            size="large"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden px-4 pt-2 pb-4">
        {searchText ? (
          <div>
            <div className="py-2 border-b border-gray-100 mb-4">
              <span className="text-sm font-bold text-gray-700">Search Results for "{searchText}"</span>
            </div>
            <Table 
              columns={columns} 
              dataSource={filteredOrders} 
              rowKey="_id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>
        ) : (
          <Tabs 
            defaultActiveKey="card" 
            items={[
              {
                key: 'card',
                label: 'Card Payments',
                children: (
                  <Table 
                    columns={columns} 
                    dataSource={orders.filter(o => o.paymentMethod === 'Card Payment')} 
                    rowKey="_id" 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                )
              },
              {
                key: 'cod',
                label: 'Cash on Delivery',
                children: (
                  <Table 
                    columns={columns} 
                    dataSource={orders.filter(o => o.paymentMethod === 'Cash on Delivery')} 
                    rowKey="_id" 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                  />
                )
              }
            ]} 
          />
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        title={<span className="font-serif text-xl">Order Details</span>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                <p className="text-lg font-bold">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Placed On</p>
                <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-serif text-lg mb-3">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
                  <p><span className="text-gray-500 w-20 inline-block">Name:</span> <strong>{selectedOrder.shippingDetails.firstName} {selectedOrder.shippingDetails.lastName}</strong></p>
                  <p><span className="text-gray-500 w-20 inline-block">Email:</span> {selectedOrder.shippingDetails.email}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Phone:</span> {selectedOrder.shippingDetails.phone}</p>
                  {selectedOrder.user && <p className="text-xs text-blue-600 mt-2">Registered User</p>}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg mb-3">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded text-sm space-y-1">
                  <p>{selectedOrder.shippingDetails.recipientName || `${selectedOrder.shippingDetails.firstName} ${selectedOrder.shippingDetails.lastName}`}</p>
                  <p>{selectedOrder.shippingDetails.address}</p>
                  <p>{selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.postalCode}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-3">Order Items</h4>
              <div className="border border-gray-100 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-3 font-medium">Item</th>
                      <th className="p-3 font-medium">Price</th>
                      <th className="p-3 font-medium">Qty</th>
                      <th className="p-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">Size: {item.variant.size} {item.variant.color ? `| Color: ${item.variant.color}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">LKR {item.price.toLocaleString()}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3 text-right font-medium">LKR {(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="font-bold text-lg">LKR {selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
