import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Layout, Typography, Divider } from 'antd';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

import Navbar from '../components/Navbar';
import AnnouncementBar from '../components/AnnouncementBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

import product1 from '../assets/images/product-1.jpg';
import product2 from '../assets/images/product-2.jpg';
import product3 from '../assets/images/product-3.jpg';
import product4 from '../assets/images/product-4.jpg';
import catMenswear from '../assets/images/cat-menswear.jpg';
import catWomenswear from '../assets/images/cat-womenswear.jpg';
import catAccessories from '../assets/images/cat-accessories.jpg';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const products = [
  { id: 1, name: "Structured Wool Blazer", price: "Rs. 45,000", img: product1, tag: "New" },
  { id: 2, name: "Silk Drape Dress", price: "Rs. 32,000", img: product2 },
  { id: 3, name: "Volume Trousers", price: "Rs. 28,000", img: product3 },
  { id: 4, name: "Cashmere Knit", price: "Rs. 51,000", img: product4, tag: "Trending" },
];

const categories = [
  { id: 1, title: 'Menswear', link: '/collections/menswear', img: catMenswear, span: 8 },
  { id: 2, title: 'Womenswear', link: '/collections/womenswear', img: catWomenswear, span: 8 },
  { id: 3, title: 'Accessories', link: '/collections/accessories', img: catAccessories, span: 8 }
];

const Home = () => {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Content>
        <Hero />

        {/* Features Strip */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} md={8} className="flex flex-col items-center text-center">
                <Truck size={28} strokeWidth={1} className="mb-4 text-gray-800" />
                <Title level={5} className="!mb-1 !font-semibold">Complimentary Shipping</Title>
                <Text type="secondary" className="text-sm">On all orders over Rs. 15,000</Text>
              </Col>
              <Col xs={24} md={8} className="flex flex-col items-center text-center">
                <RefreshCw size={28} strokeWidth={1} className="mb-4 text-gray-800" />
                <Title level={5} className="!mb-1 !font-semibold">Free Returns</Title>
                <Text type="secondary" className="text-sm">Within 14 days of purchase</Text>
              </Col>
              <Col xs={24} md={8} className="flex flex-col items-center text-center">
                <ShieldCheck size={28} strokeWidth={1} className="mb-4 text-gray-800" />
                <Title level={5} className="!mb-1 !font-semibold">Secure Checkout</Title>
                <Text type="secondary" className="text-sm">100% encrypted payment</Text>
              </Col>
            </Row>
          </div>
        </div>

        {/* New Arrivals */}
        <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Text className="text-gray-500 tracking-widest uppercase text-xs font-semibold mb-2 block">Latest Drops</Text>
              <Title level={2} className="!font-serif !m-0 !text-4xl">New Arrivals</Title>
            </div>
            <a href="#view-all" className="text-sm font-medium border-b border-black pb-0.5 hover:text-gray-600 transition-colors hidden md:block">
              View All Pieces
            </a>
          </div>

          <Row gutter={[32, 48]}>
            {products.map((product) => (
              <Col xs={24} sm={12} lg={6} key={product.id}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                    {product.tag && (
                      <div className="absolute top-4 left-4 z-20 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
                        {product.tag}
                      </div>
                    )}
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <Button 
                        type="default" 
                        className="bg-white/90 backdrop-blur-sm border-none w-10/12 h-12 text-sm font-semibold tracking-wider hover:!bg-black hover:!text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                      >
                        QUICK ADD
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <Text className="text-gray-500 text-xs tracking-widest uppercase mb-1 block">StyleHub</Text>
                    <Title level={5} className="!font-normal !mb-1 !text-base">{product.name}</Title>
                    <Text className="font-medium">{product.price}</Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="mt-12 text-center md:hidden">
            <Button type="default" className="w-full h-12 border-black text-black">View All Pieces</Button>
          </div>
        </section>

        {/* Curated Categories */}
        <section className="pb-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
          <Title level={2} className="!font-serif !text-4xl text-center !mb-12">Curated For You</Title>
          <Row gutter={[24, 24]}>
            {categories.map((category) => (
              <Col xs={24} md={category.span} key={category.id}>
                <Link to={category.link} className="block relative overflow-hidden aspect-[4/5] group cursor-pointer">
                  <img 
                    src={category.img} 
                    alt={category.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-white text-3xl font-serif mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {category.title}
                    </h3>
                    <div className="overflow-hidden">
                      <span className="text-white text-sm font-medium tracking-widest uppercase border-b border-white/40 pb-1 inline-block transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                        Shop Collection
                      </span>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gray-100 py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Title level={2} className="!font-serif !text-4xl !mb-4">Join the Club.</Title>
            <Paragraph className="text-gray-600 mb-8 text-lg">
              Subscribe to receive early access to new collections, exclusive events, and styling advice.
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-transparent border-b border-gray-400 focus:border-black outline-none px-2 py-3 text-base transition-colors"
              />
              <Button type="primary" size="large" className="rounded-none h-12 px-8 uppercase tracking-widest text-xs font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </Content>

      <Footer />
    </>
  );
};

export default Home;
