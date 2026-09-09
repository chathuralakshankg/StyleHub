import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Check } from 'lucide-react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('Add your location');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          form.setFieldsValue({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address || {},
          });

          if (data.address?.city || data.address?.country) {
            setDisplayLocation(`${data.address.city || ''}${data.address.city && data.address.country ? ', ' : ''}${data.address.country || ''}`);
          }
        } else {
          message.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('An error occurred while fetching your profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Profile updated successfully');
        const updatedUserInfo = { ...userInfo, name: data.name, email: data.email };
        login(updatedUserInfo);

        if (values.address?.city || values.address?.country) {
          setDisplayLocation(`${values.address.city || ''}${values.address.city && values.address.country ? ', ' : ''}${values.address.country || ''}`);
        }
      } else {
        message.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa]">
        <Spin size="large" />
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#111]">
      <div className="max-w-3xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Account Sanctuary</p>
            <h1 className="text-5xl font-serif tracking-tight text-gray-900">Personal Profile</h1>
          </div>
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600 hover:text-black flex items-center gap-1">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        {/* User Overview Section */}
        <div className="flex items-center gap-6 mb-16">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-serif tracking-wider shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-serif text-gray-900 mb-1">{user?.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{user?.email}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> {displayLocation}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-12"
        >
          {/* Personal Details */}
          <div>
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-serif text-gray-900 mb-1">Personal Details</h3>
              <p className="text-xs text-gray-500">Manage your personal identity and direct contact information.</p>
            </div>

            <div className="space-y-6">
              <Form.Item
                label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Full Name</span>}
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                />
              </Form.Item>



              <Form.Item
                label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Phone Number</span>}
                className="mb-0"
              >
                <div className="flex">
                  <div className="bg-[#f4f4f4] px-4 py-3 border-r border-white flex items-center justify-center rounded-l-sm min-w-[80px]">
                    <span className="text-xs font-bold text-gray-900">LK<br />(+94)</span>
                  </div>
                  <Form.Item name="phone" noStyle>
                    <Input
                      size="large"
                      placeholder="77 123 4567"
                      className="rounded-none rounded-r-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium w-full"
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-serif text-gray-900 mb-1">Shipping Address</h3>
              <p className="text-xs text-gray-500">Your default sanctuary address for bespoke hand-couriered releases.</p>
            </div>

            <div className="space-y-6">
              <Form.Item
                label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Recipient Name</span>}
                name={['address', 'recipientName']}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Street Address / Address Line 01</span>}
                name={['address', 'streetAddress']}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Address Line 02 (Locality / Landmark)</span>}
                name={['address', 'addressLine2']}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">City</span>}
                  name={['address', 'city']}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Postal Code</span>}
                  name={['address', 'postalCode']}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">District</span>}
                  name={['address', 'district']}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-900">Country / Sovereign State</span>}
                  name={['address', 'country']}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="rounded-sm border-0 bg-[#f4f4f4] hover:bg-[#eaeaea] focus:bg-[#eaeaea] shadow-none px-4 py-3 text-sm transition-colors text-gray-900 font-medium"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12 mb-16">
            <button
              type="button"
              onClick={() => form.resetFields()}
              className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-black transition-colors"
            >
              Discard Changes
            </button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              className="bg-black hover:bg-gray-900 focus:bg-black text-white rounded-sm px-8 h-12 text-[11px] font-bold tracking-[0.1em] uppercase border-0 flex items-center justify-center gap-2"
            >
              <Check size={14} strokeWidth={3} /> Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Profile;
