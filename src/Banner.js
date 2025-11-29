import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Upload,
  Switch,
  Select,
  message,
  Tabs,
  Space,
  Grid,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import BannerService from './services/BannerService';

const { useBreakpoint } = Grid;

const Banner = () => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [banners, setBanners] = useState([
    {
      id: 7,
      title: 'Gram Panchyat Chikhli',
      subtitle: 'Welcome to the Chikhli Village Panchayat!',
      background_image: 'https://sooooper.com/media/banner/carousel-item_1.png',
      is_active: true,
      language: 'English',
      clientId: '1',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [viewingBanner, setViewingBanner] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch banners from API
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await BannerService.getBanners();
      setBanners(response.data);
      message.success('Banners loaded');
    } catch (error) {
      message.error('Failed to load banners');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [isModalVisible]);

  // Handle form submission
  const handleSubmit = async (values) => {
    // If creating, ensure an image is provided. For edits, image is optional.
    if (!selectedFile && !editingBanner) {
      message.error('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      if (editingBanner) {
        // Build payload excluding any image URL/string when no new file selected
        const payload = {
          title: values.title,
          subtitle: values.subtitle,
          language: values.language,
          clientId: values.clientId,
          is_active: values.is_active,
        };
        // PUT request to update (send JSON payload when no new file)
        await BannerService.updateBanner(editingBanner.id, payload, selectedFile);
        const updatedBanner = {
          ...editingBanner,
          ...payload,
        };
        setBanners(banners.map((b) => (b.id === editingBanner.id ? updatedBanner : b)));
        message.success('Banner updated successfully');
      } else {
        // POST request to create
        const response = await BannerService.createBanner(values, selectedFile);
        const newBanner = response.data;
        setBanners([...banners, newBanner]);
        message.success('Banner created successfully');
      }
      form.resetFields();
      setIsModalVisible(false);
      setEditingBanner(null);
      setUploadedImageUrl(null);
      setSelectedFile(null);
    } catch (error) {
      message.error('Failed to save banner');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    form.setFieldsValue(banner);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: 'Are you sure you want to delete this banner?',
      okText: 'Yes',
      cancelText: 'No',
      async onOk() {
        try {
          await BannerService.deleteBanner(id);
          setBanners(banners.filter((b) => b.id !== id));
          message.success('Banner deleted successfully');
        } catch (error) {
          message.error('Failed to delete banner');
          console.error(error);
        }
      },
    });
  };

  // Handle view
  const handleView = (banner) => {
    setViewingBanner(banner);
    setIsViewModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      form.resetFields();
      setEditingBanner(null);
      setUploadedImageUrl(null);
      setSelectedFile(null);
    }, 0);
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      // Store the file object
      setSelectedFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      message.success('Image selected successfully');
      return false;
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to select image');
      return false;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span>{text}</span>,
      responsive: ['md'],
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
      key: 'subtitle',
      render: (text) => <span>{text}</span>,
      responsive: ['lg'],
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      responsive: ['md'],
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (isActive ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: screens.lg ? 200 : screens.md ? 150 : 120,
      render: (_, record) => (
        <Space wrap size={screens.md ? 'middle' : 'small'}>
          <Button
            type="primary"
            size={screens.md ? 'small' : 'small'}
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            {screens.md && 'View'}
          </Button>
          <Button
            type="default"
            size={screens.md ? 'small' : 'small'}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {screens.md && 'Edit'}
          </Button>
          <Button
            type="primary"
            danger
            size={screens.md ? 'small' : 'small'}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {screens.md && 'Delete'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: screens.xs ? '12px' : screens.sm ? '16px' : '20px',
      overflow: 'hidden'
    }}>
      <Tabs
        items={[
          {
            key: 'list',
            label: 'Banner List',
            children: (
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingBanner(null);
                    form.resetFields();
                    setUploadedImageUrl(null);
                    setSelectedFile(null);
                    setIsModalVisible(true);
                  }}
                  style={{ marginBottom: '16px', width: screens.xs ? '100%' : 'auto' }}
                  block={screens.xs}
                >
                  Add New Banner
                </Button>
                <Table
                  columns={columns}
                  dataSource={banners}
                  loading={loading}
                  rowKey="id"
                  pagination={{ 
                    pageSize: screens.xs ? 5 : screens.sm ? 7 : 10,
                    responsive: true,
                    showSizeChanger: screens.md,
                  }}
                  scroll={{ x: 'max-content' }}
                  size={screens.md ? 'middle' : 'small'}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={screens.xs ? '95%' : screens.sm ? '90%' : screens.md ? '600px' : '600px'}
        style={{ top: screens.xs ? 20 : 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: false,
            language: 'English',
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter banner title' }]}
          >
            <Input placeholder="Enter banner title" size={screens.md ? 'middle' : 'large'} />
          </Form.Item>

          <Form.Item
            label="Subtitle"
            name="subtitle"
            rules={[{ required: true, message: 'Please enter banner subtitle' }]}
          >
            <Input.TextArea 
              placeholder="Enter banner subtitle" 
              rows={screens.xs ? 2 : 3}
              size={screens.md ? 'middle' : 'large'}
            />
          </Form.Item>

          <Form.Item
            label="Background Image"
            name="background_image"
            rules={editingBanner ? [] : [{ required: true, message: 'Please upload an image' }]}
          >
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={handleImageUpload}
              listType="picture"
            >
              <Button icon={<UploadOutlined />} block={screens.xs}>Choose File</Button>
            </Upload>
            {uploadedImageUrl && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: screens.xs ? '150px' : '200px',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item label="Is active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
            rules={[{ required: true, message: 'Please select language' }]}
          >
            <Select
              placeholder="Select language"
              options={[
                { label: 'English', value: 'English' },
                { label: 'Marathi', value: 'Marathi' },
                { label: 'Hindi', value: 'Hindi' },
              ]}
              size={screens.md ? 'middle' : 'large'}
            />
          </Form.Item>

          <Form.Item
            label="ClientId"
            name="clientId"
            rules={[{ required: true, message: 'Please enter client ID' }]}
          >
            <Input placeholder="Enter client ID" size={screens.md ? 'middle' : 'large'} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              size={screens.md ? 'middle' : 'large'}
            >
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Banner Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={screens.xs ? '95%' : screens.sm ? '90%' : screens.md ? '600px' : '600px'}
        style={{ top: screens.xs ? 20 : 'auto' }}
      >
        {viewingBanner && (
          <div style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
            <p>
              <strong>Title:</strong> {viewingBanner.title}
            </p>
            <p>
              <strong>Subtitle:</strong> {viewingBanner.subtitle}
            </p>
            <p>
              <strong>Language:</strong> {viewingBanner.language}
            </p>
            <p>
              <strong>Client ID:</strong> {viewingBanner.clientId}
            </p>
            <p>
              <strong>Active:</strong> {viewingBanner.is_active ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Background Image:</strong>
            </p>
            {viewingBanner.background_image && (
              <img
                src={viewingBanner.background_image}
                alt="banner"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: screens.xs ? '200px' : '300px',
                  marginTop: '10px',
                  borderRadius: '4px'
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Banner;
