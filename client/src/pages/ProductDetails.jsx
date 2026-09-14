import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout, Button, Typography, Spin, message, Divider, Tag, Breadcrumb } from 'antd';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { CartContext } from '../context/CartContext';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  // Selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
      
      // Auto-select first available color if it exists
      const colors = [...new Set(data.variants?.map(v => v.color).filter(Boolean))];
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      message.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout className="min-h-screen bg-white">
        <Navbar />
        <Content className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout className="min-h-screen bg-white">
        <Navbar />
        <Content className="flex flex-col items-center justify-center h-[60vh]">
          <Title level={3}>Product Not Found</Title>
          <Button onClick={() => navigate('/collections')}>Back to Collections</Button>
        </Content>
      </Layout>
    );
  }

  // Derive unique colors
  const availableColors = [...new Set(product.variants?.map(v => v.color).filter(Boolean))];

  // Derive available sizes for the selected color (or all if no color)
  const availableVariants = product.variants?.filter(v => {
    if (selectedColor && v.color !== selectedColor) return false;
    return true;
  }) || [];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
    
    // Auto update main image to variant image if available
    const variantWithImage = product.variants?.find(v => v.color === color && v.image);
    if (variantWithImage && variantWithImage.image) {
      setMainImage(variantWithImage.image);
    }
  };

  const handleAddToCart = () => {
    if (availableColors.length > 0 && !selectedColor) {
      message.warning('Please select a color');
      return;
    }
    if (!selectedSize) {
      message.warning('Please select a size');
      return;
    }

    const variant = product.variants.find(v => 
      v.size === selectedSize && 
      (selectedColor ? v.color === selectedColor : true)
    );

    if (!variant || variant.stock < 1) {
      message.error('This variant is out of stock');
      return;
    }

    addToCart(product, variant, 1);
    navigate('/cart');
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Navbar />
      
      <Content className="max-w-7xl mx-auto w-full px-6 py-8">
        <Breadcrumb className="mb-8" separator=">">
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/collections/${product.category.toLowerCase()}`}>{product.category}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{product.subCategory}</Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Images Section */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-20 md:max-h-[600px] no-scrollbar">
              {product.images?.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`w-20 h-24 flex-shrink-0 cursor-pointer border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Also show variant images in the thumbnail list if they exist and are not already in product.images */}
              {product.variants?.filter(v => v.image && !product.images.includes(v.image)).map((v, idx) => (
                <div 
                  key={`var-img-${idx}`} 
                  className={`w-20 h-24 flex-shrink-0 cursor-pointer border-2 transition-all ${mainImage === v.image ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  onClick={() => {
                    setMainImage(v.image);
                    if (v.color) setSelectedColor(v.color);
                  }}
                  title={`Color: ${v.color}`}
                >
                  <img src={v.image} alt={v.color} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            <div className="flex-1 bg-gray-50 h-[400px] md:h-[600px]">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col py-4">
            <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">{product.category}</div>
            <Title level={2} className="!mb-2 !font-serif">{product.name}</Title>
            <div className="text-xl font-medium mb-6">LKR {product.price.toLocaleString()}</div>
            
            <Paragraph className="text-gray-600 mb-6 whitespace-pre-wrap">
              {product.description || `Premium quality ${product.subCategory.toLowerCase()} made from carefully selected materials.`}
            </Paragraph>

            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-900 block mb-2">Material</span>
              <Text className="text-gray-600">{product.fabric}</Text>
            </div>

            <Divider className="my-6" />

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="mb-8">
                <span className="text-sm font-semibold text-gray-900 block mb-3">
                  Color: <span className="font-normal text-gray-600 ml-1">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(color => {
                    // Try to find a variant image for this color
                    const varImg = product.variants?.find(v => v.color === color && v.image)?.image;
                    
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`relative w-16 h-20 border transition-all overflow-hidden ${selectedColor === color ? 'border-black border-2' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        {varImg ? (
                          <img src={varImg} alt={color} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">{color}</div>
                        )}
                        {selectedColor === color && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                            <Check className="text-white drop-shadow-md" size={24} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-900">Select Size</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableVariants.map(variant => {
                  const outOfStock = variant.stock < 1;
                  return (
                    <button
                      key={variant._id || variant.size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`min-w-[3rem] h-12 px-4 border text-sm transition-all flex items-center justify-center
                        ${outOfStock ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' : 
                          selectedSize === variant.size ? 'bg-black text-white border-black font-medium' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}
                      `}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const totalStock = availableVariants.reduce((sum, v) => sum + v.stock, 0);
                if (totalStock === 0) {
                  return (
                    <div className="mt-3 text-xs text-red-600 flex items-center gap-1 font-medium">
                      Out of stock
                    </div>
                  );
                }
                return selectedSize ? (
                  <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                    <Check size={14} /> 
                    {availableVariants.find(v => v.size === selectedSize)?.stock} items in stock for this size
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                    <Check size={14} /> 
                    {totalStock} items in stock
                  </div>
                );
              })()}
            </div>

            <Button 
              type="primary" 
              className={`h-14 text-base tracking-widest uppercase font-medium mt-auto ${availableVariants.length === 0 || product.variants?.reduce((sum, v) => sum + v.stock, 0) === 0 ? 'bg-gray-400 text-white cursor-not-allowed border-none hover:bg-gray-400 hover:text-white' : 'bg-black'}`} 
              block 
              disabled={availableVariants.length === 0 || product.variants?.reduce((sum, v) => sum + v.stock, 0) === 0}
              icon={(availableVariants.length > 0 && product.variants?.reduce((sum, v) => sum + v.stock, 0) > 0) && <ShoppingBag size={18} />}
              onClick={handleAddToCart}
            >
              {(availableVariants.length === 0 || product.variants?.reduce((sum, v) => sum + v.stock, 0) === 0) ? 'Out of Stock' : 'Add to Bag'}
            </Button>
            
            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-6">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900">Delivery</span>
                <span>Island-wide delivery available within 3-5 working days.</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900">Returns</span>
                <span>7-day return policy for unused items with tags.</span>
              </div>
            </div>

          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ProductDetails;
