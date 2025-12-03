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
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import BannerService from './services/BannerService';

const Banner = () => {
  const [form] = Form.useForm();
  const [banners, setBanners] = useState([
    {
      id: 7,
      title: 'Gram Panchyat Chikhli',
      subtitle: 'Welcome to the Chikhli Village Panchayat!',
      background_image: 'https://sooooper.com/media/banner/carousel-item_1.png',
      is_active: true,
      language: 'English',
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
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
      key: 'subtitle',
      render: (text) => <div style={{ maxWidth: 300, whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
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
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>View</Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
        <h3 style={{ margin: 0 }}>Banners</h3>
        <div style={{ flexShrink: 0 }}>
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
          >
            Add
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingBanner ? 'Edit Banner' : 'Create Banner'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
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
            <Input placeholder="Enter banner title" />
          </Form.Item>

          <Form.Item
            label="Subtitle"
            name="subtitle"
            rules={[{ required: true, message: 'Please enter banner subtitle' }]}
          >
            <Input.TextArea placeholder="Enter banner subtitle" rows={3} />
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
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
            {uploadedImageUrl && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Language"
            name="language"
            rules={[{ required: true, message: 'Please select language' }]}
          >
            <Select
              allowClear
              options={[
                { label: 'English', value: 'English' },
                { label: 'Marathi', value: 'Marathi' },
                { label: 'Hindi', value: 'Hindi' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingBanner ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Banner"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsViewModalVisible(false)}>Close</Button>]}
      >
        {viewingBanner && (
          <div>
            <p><strong>Title:</strong> {viewingBanner.title}</p>
            <p><strong>Subtitle:</strong> {viewingBanner.subtitle}</p>
            <p><strong>Language:</strong> {viewingBanner.language}</p>
            <p><strong>Active:</strong> {viewingBanner.is_active ? 'Yes' : 'No'}</p>
            {viewingBanner.background_image && (
              <p>
                <strong>Background Image:</strong><br />
                <img
                  src={viewingBanner.background_image}
                  alt="banner"
                  style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px', borderRadius: '4px' }}
                />
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Banner;
