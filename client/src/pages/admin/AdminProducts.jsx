import React, { useState, useEffect, useContext } from 'react';
import { Table, Typography, Button, Space, Modal, Form, Input, InputNumber, Upload, message, Popconfirm, Select, Card } from 'antd';
import { Edit, Trash2, Plus, Upload as UploadIcon, MinusCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products');
    }
  };

  const showAddModal = () => {
    setEditingId(null);
    setFileList([]);
    form.resetFields();
    // Default variant
    form.setFieldsValue({ variants: [{ size: '', stock: 0 }] });
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingId(record._id);
    
    // Convert existing image URLs to Ant Design Upload fileList format
    const existingFileList = record.images ? record.images.map((img, index) => ({
      uid: `-existing-${index}`,
      name: `Image ${index + 1}`,
      status: 'done',
      url: img,
      response: img
    })) : [];
    
    setFileList(existingFileList);
    
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      category: record.category ? [record.category] : [],
      subCategory: record.subCategory ? [record.subCategory] : [],
      fabric: record.fabric,
      price: record.price,
      variants: record.variants && record.variants.length > 0 ? record.variants.map(v => {
        const mapped = { size: v.size, color: v.color, stock: v.stock };
        if (v.image) {
          mapped.image = [{ uid: `-variant-${v._id || Math.random()}`, name: 'image', status: 'done', url: v.image }];
        }
        return mapped;
      }) : [{ size: '', stock: 0 }]
    });
    
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        message.success('Product deleted successfully');
        fetchProducts();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('category', values.category ? (Array.isArray(values.category) ? values.category[0] : values.category) : '');
      formData.append('subCategory', values.subCategory ? (Array.isArray(values.subCategory) ? values.subCategory[0] : values.subCategory) : '');
      formData.append('fabric', values.fabric);
      formData.append('price', values.price);

      // Process variants
      const processedVariants = values.variants ? values.variants.map((v, index) => {
        const variant = { size: v.size, color: v.color, stock: v.stock };
        if (v.image && v.image.length > 0) {
          const fileItem = v.image[0];
          if (fileItem.originFileObj) {
            formData.append(`variantImage_${index}`, fileItem.originFileObj);
            variant.hasNewImage = true;
          } else if (fileItem.url || fileItem.response) {
            variant.image = fileItem.url || fileItem.response;
          }
        }
        return variant;
      }) : [];

      formData.append('variants', JSON.stringify(processedVariants));

      // Separate new files from existing images
      const existingImages = [];
      fileList.forEach(file => {
        const actualFile = file.originFileObj || file;
        // Check if it's a native File object (new upload)
        if (actualFile instanceof File || actualFile instanceof Blob) {
          formData.append('images', actualFile);
        } 
        // Otherwise, if it's an existing image object
        else if (file.response || file.url) {
          existingImages.push(file.response || file.url);
        }
      });
      
      if (editingId) {
          formData.append('existingImages', JSON.stringify(existingImages));
      }

      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';
        
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success(`Product ${editingId ? 'updated' : 'added'} successfully`);
        setIsModalVisible(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || `Failed to ${editingId ? 'update' : 'add'} product`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('An error occurred while saving the product');
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
    listType: "picture-card"
  };

  const columns = [
    { 
      title: 'Image', 
      key: 'image',
      render: (_, record) => (
        record.images && record.images.length > 0 ? (
          <img 
            src={record.images[0]} 
            alt={record.name} 
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} 
          />
        ) : (
          <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
            No Img
          </div>
        )
      )
    },
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Sub-Category', dataIndex: 'subCategory', key: 'subCategory' },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => `LKR ${price.toFixed(2)}`
    },
    { 
      title: 'Total Stock', 
      key: 'stock',
      render: (_, record) => {
        const totalStock = record.variants ? record.variants.reduce((acc, variant) => acc + variant.stock, 0) : 0;
        return totalStock;
      }
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<Edit size={16} />} onClick={() => showEditModal(record)} />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">Product Management</Title>
        <Button type="primary" className="bg-black" onClick={showAddModal}>Add Product</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="_id"
        className="bg-white border border-gray-200 rounded"
      />

      <Modal
        title={editingId ? "Edit Product" : "Add New Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input placeholder="e.g. Structured Wool Blazer" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              className="md:col-span-2"
              rules={[{ required: true, message: 'Please enter product description' }]}
            >
              <Input.TextArea rows={4} placeholder="Product description..." />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select or enter category' }]}
            >
              <Select placeholder="Select a category" allowClear mode="tags" maxCount={1} onChange={() => form.setFieldsValue({ subCategory: [] })}>
                <Option value="Menswear">Menswear</Option>
                <Option value="Womenswear">Womenswear</Option>
                <Option value="Accessories">Accessories</Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
            >
              {({ getFieldValue }) => {
                const categoryRaw = getFieldValue('category');
                const catStr = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
                
                let subOptions = [];
                if (catStr === 'Menswear') {
                  subOptions = ['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Shorts', 'Sarongs'];
                } else if (catStr === 'Womenswear') {
                  subOptions = ['Blouses & Tops', 'Dresses', 'Frocks', 'Skirts', 'Trousers/Jeans', 'Sarees'];
                } else if (catStr === 'Accessories') {
                  subOptions = ['Ties', 'Belts', 'Vests', 'Socks'];
                }

                return (
                  <Form.Item
                    name="subCategory"
                    label="Sub-Category"
                    rules={[{ required: true, message: 'Please select sub-category' }]}
                  >
                    <Select 
                      placeholder={!catStr ? "Select a category first" : "Select or type a sub-category"} 
                      allowClear 
                      mode="tags" 
                      maxCount={1}
                      notFoundContent={!catStr ? "Select a category first" : "Type to add custom sub-category"}
                    >
                      {subOptions.map(opt => (
                        <Option key={opt} value={opt}>{opt}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              }}
            </Form.Item>

            <Form.Item
              name="fabric"
              label="Fabric / Material"
              rules={[{ required: true, message: 'Please enter fabric or material details' }]}
            >
              <Input placeholder="e.g. 100% Cotton, Linen Blend" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (LKR)"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" placeholder="0.00" />
            </Form.Item>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-medium">Product Images</p>
            <Upload {...uploadProps}>
              {fileList.length >= 5 ? null : (
                <div>
                  <UploadIcon size={20} className="mx-auto" />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
          >
            {({ getFieldValue }) => {
              const categoryRaw = getFieldValue('category');
              const catStr = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
              const showColor = catStr === 'Menswear' || catStr === 'Womenswear';

              return (
                <Card title={`Product Variants (Size${showColor ? ', Color' : ''}, Stock)`} size="small" className="mb-6">
                  <Form.List name="variants">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
                            <Form.Item
                              {...restField}
                              name={[name, 'size']}
                              rules={[{ required: true, message: 'Missing size' }]}
                              style={{ margin: 0 }}
                            >
                              <Input placeholder="Size (e.g. S, M, L)" />
                            </Form.Item>

                            {showColor && (
                              <>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'color']}
                                  rules={[{ required: true, message: 'Missing color' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input placeholder="Color (e.g. Red)" />
                                </Form.Item>

                                <Form.Item
                                  {...restField}
                                  name={[name, 'image']}
                                  valuePropName="fileList"
                                  getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) return e;
                                    return e && e.fileList;
                                  }}
                                  style={{ margin: 0 }}
                                >
                                  <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                                    <Button icon={<UploadIcon size={14} />} size="small">Img</Button>
                                  </Upload>
                                </Form.Item>
                              </>
                            )}

                            <Form.Item
                              {...restField}
                              name={[name, 'stock']}
                              rules={[{ required: true, message: 'Missing stock' }]}
                              style={{ margin: 0 }}
                            >
                              <InputNumber min={0} placeholder="Stock" />
                            </Form.Item>
                            <MinusCircle onClick={() => remove(name)} className="text-red-500 hover:text-red-700 cursor-pointer" size={20} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<Plus size={16} />}>
                            Add Variant
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              );
            }}
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="bg-black">
                {editingId ? "Save Changes" : "Create Product"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
