import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import TaxPaymentService from './services/TaxPaymentService';

const TaxPayment = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await TaxPaymentService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load tax payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      language: record.language,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete tax payment',
      content: 'Are you sure?',
      async onOk() {
        try {
          await TaxPaymentService.deleteItem(id);
          message.success('Deleted');
          fetch();
        } catch (err) {
          console.error(err);
          message.error('Delete failed');
        }
      }
    });
  };

  const handleView = (record) => {
    setViewing(record);
    setIsViewOpen(true);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('language', values.language || '');
    if (imageFile) formData.append('image', imageFile);

    setLoading(true);
    try {
      if (editing) {
        await TaxPaymentService.updateItem(editing.id, formData);
        message.success('Updated');
      } else {
        await TaxPaymentService.createItem(formData);
        message.success('Created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setImageFile(null);
      fetch();
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (img) => img ? <img src={img} alt="tax" style={{maxWidth:60, maxHeight:40}} /> : '-' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" onClick={()=>handleView(r)}>View</Button>
        <Button icon={<EditOutlined />} size="small" onClick={()=>openEdit(r)}>Edit</Button>
        <Button danger icon={<DeleteOutlined />} size="small" onClick={()=>handleDelete(r.id)}>Delete</Button>
      </Space>
    ) }
  ];

  return (
    <div style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, gap:12}}>
        <h3 style={{margin:0}}>Tax Payments</h3>
        <div style={{flexShrink:0}}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        pagination={{pageSize:10}}
      />

      <Modal title={editing ? 'Edit Tax Payment' : 'Add Tax Payment'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setImageFile(null);}} footer={null} width={500}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={(file) => { setImageFile(file); return false; }}
              onRemove={() => setImageFile(null)}
              fileList={imageFile ? [imageFile] : []}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="language" label="Language">
            <Select allowClear options={[{label:'English', value:'English'},{label:'Marathi', value:'Marathi'},{label:'Hindi', value:'Hindi'}]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Tax Payment" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Image:</strong> {viewing.image ? <img src={viewing.image} alt="tax" style={{maxWidth:200}} /> : '-'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaxPayment;
