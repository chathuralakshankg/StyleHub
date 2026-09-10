import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Form, Input, Button, Typography, message } from 'antd';
import { CreditCard, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const orderData = location.state?.orderData;

  if (!orderData) {
    return <Navigate to="/cart" replace />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    
    // Simulate a payment gateway processing time
    setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to place order after payment');
        }

        message.success('Payment successful! Order placed.');
        clearCart();
        navigate('/checkout-success', { state: { orderId: data._id } });

      } catch (error) {
        message.error(error.message);
        setLoading(false);
      }
    }, 2000); // 2 second delay to simulate payment processing
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Navbar />
      
      <Content className="max-w-2xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-10">
          <CreditCard size={48} className="mx-auto text-gray-800 mb-4" />
          <Title level={2} className="!font-serif !mb-2">Secure Payment</Title>
          <Text className="text-gray-500">Please enter your card details below to complete your order.</Text>
        </div>

        <div className="bg-gray-50 p-8 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <Text className="font-semibold text-lg">Total Amount</Text>
            <Text className="font-bold text-xl">LKR {orderData.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</Text>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[{ required: true, message: 'Please enter card number' }]}
            >
              <Input size="large" placeholder="0000 0000 0000 0000" maxLength={19} className="rounded-none border-gray-300" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="expiry"
                label="Expiry Date"
                rules={[{ required: true, message: 'MM/YY' }]}
              >
                <Input size="large" placeholder="MM/YY" maxLength={5} className="rounded-none border-gray-300" />
              </Form.Item>

              <Form.Item
                name="cvv"
                label="CVV"
                rules={[{ required: true, message: 'CVV' }]}
              >
                <Input size="large" placeholder="123" maxLength={4} type="password" className="rounded-none border-gray-300" />
              </Form.Item>
            </div>

            <Form.Item
              name="nameOnCard"
              label="Name on Card"
              rules={[{ required: true, message: 'Please enter name as on card' }]}
            >
              <Input size="large" placeholder="John Doe" className="rounded-none border-gray-300" />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-black w-full h-14 text-sm tracking-widest uppercase font-semibold mt-4 flex items-center justify-center gap-2"
            >
              <Lock size={16} /> Pay Now
            </Button>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Payment;
