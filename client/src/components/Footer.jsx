import React from 'react';
import { Layout, Row, Col, Typography, Divider } from 'antd';

const { Footer: AntdFooter } = Layout;
const { Paragraph } = Typography;

const Footer = () => {
  return (
    <AntdFooter className="bg-black text-white py-20 px-6 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        <Row gutter={[48, 48]} className="mb-16">
          <Col xs={24} lg={8}>
            <div className="text-3xl font-serif font-semibold tracking-tighter mb-6">
              Style<span className="text-gray-500">Hub</span>.
            </div>
            <Paragraph className="text-gray-400 max-w-sm mb-8">
              Redefining modern luxury through silence, form, and uncompromised quality. Based in Colombo, Sri Lanka.
            </Paragraph>
            <div className="flex gap-4 text-sm font-medium tracking-widest uppercase">
              <a href="#" className="text-white hover:text-gray-400 transition-colors">Instagram</a>
              <a href="#" className="text-white hover:text-gray-400 transition-colors">Facebook</a>
              <a href="#" className="text-white hover:text-gray-400 transition-colors">Twitter</a>
            </div>
          </Col>
          
          <Col xs={12} sm={8} lg={5} lgOffset={1}>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-gray-300">Shop</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Menswear</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Womenswear</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessories</a>
            </div>
          </Col>

          <Col xs={12} sm={8} lg={5}>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-gray-300">Support</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>
          </Col>

          <Col xs={24} sm={8} lg={5}>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6 text-gray-300">Legal</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </Col>
        </Row>

        <Divider className="border-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm mt-8">
          <div>© 2024 StyleHub. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 rounded-full bg-green-500"></span>
            Site Operational
          </div>
        </div>
      </div>
    </AntdFooter>
  );
};

export default Footer;
