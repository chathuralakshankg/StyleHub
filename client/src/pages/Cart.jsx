import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, InputNumber, Divider, Empty } from 'antd';
import { Trash2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <Layout className="min-h-screen bg-white">
      <Navbar />
      
      <Content className="max-w-7xl mx-auto w-full px-6 py-12">
        <Title level={2} className="!mb-8 !font-serif text-center">Your Shopping Bag</Title>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Empty description="Your bag is empty" className="mb-6" />
            <Button type="primary" className="bg-black h-12 px-8" onClick={() => navigate('/collections')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100 relative">
                  <Link to={`/product/${item.product._id}`} className="w-24 h-32 flex-shrink-0 bg-gray-50 block">
                    <img 
                      src={item.variant.image || (item.product.images && item.product.images[0])} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </Link>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.product._id}`}>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors">{item.product.name}</h3>
                        </Link>
                        <span className="font-semibold text-gray-900 whitespace-nowrap ml-4">
                          LKR {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1 flex flex-col gap-1">
                        {item.variant.color && <span>Color: {item.variant.color}</span>}
                        <span>Size: {item.variant.size}</span>
                        <span className="text-xs">LKR {item.product.price.toLocaleString()} each</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Qty:</span>
                        <InputNumber 
                          min={1} 
                          max={item.variant.stock}
                          value={item.quantity} 
                          onChange={(val) => updateQuantity(item.id, val)}
                          className="w-16"
                        />
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 p-6 md:p-8 rounded-sm sticky top-24">
                <Title level={4} className="!mb-6">Order Summary</Title>
                
                <div className="flex justify-between mb-4 text-sm">
                  <Text className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</Text>
                  <Text className="font-medium">LKR {subtotal.toLocaleString()}</Text>
                </div>
                
                <div className="flex justify-between mb-4 text-sm">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text className="text-gray-500">Calculated at checkout</Text>
                </div>

                <Divider className="my-4" />

                <div className="flex justify-between mb-8">
                  <Text className="font-bold text-base">Total</Text>
                  <Text className="font-bold text-lg">LKR {subtotal.toLocaleString()}</Text>
                </div>

                <Button 
                  type="primary" 
                  onClick={() => navigate('/checkout')}
                  className="bg-black w-full h-14 text-sm tracking-widest uppercase font-semibold flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </Button>

                <div className="mt-4 text-center">
                  <Link to="/collections" className="text-xs text-gray-500 underline underline-offset-4 hover:text-black transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Cart;
