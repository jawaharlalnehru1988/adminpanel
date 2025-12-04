import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import AdministrationService from './services/AdministrationService';

const { Option } = Select;

const Administration = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [lastDebug, setLastDebug] = useState(null);
  const [form] = Form.useForm();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await AdministrationService.getAdministrations();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load administration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      designation: record.designation,
      contact: record.contact,
      tags: record.tags,
      language: record.language || undefined,
      whatsapp: record.whatsapp,
      order: record.order,
    });
    setSelectedFile(null);
    setPreviewUrl(record.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete administration',
      content: 'Are you sure?',
      async onOk() {
        try {
          await AdministrationService.deleteAdministration(id);
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

  const beforeUpload = (file) => {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      message.error('Invalid image type. Allowed: jpg, png, webp');
      return false;
    }
    if (file.size > maxSize) {
      message.error('Image must be smaller than 5MB');
      return false;
    }

    // store file and preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // prevent upload by Upload component
    return false;
  };

  const onFinish = async (values) => {
    const payload = {
      name: values.name,
      designation: values.designation || '',
      contact: values.contact || '',
      tags: values.tags || '',
      language: values.language || '',
      whatsapp: values.whatsapp || '',
      order: values.order != null ? values.order : 0,
    };

    setLoading(true);
    try {
      // capture debug info for QA
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(payload).forEach((k) => fd.append(k, payload[k]));
        fd.append('image', selectedFile);
        const debug = { mode: 'multipart', entries: [] };
        for (const pair of fd.entries()) debug.entries.push([pair[0], pair[1] && pair[1].name ? pair[1].name : typeof pair[1]]);
        setLastDebug(debug);
      } else {
        setLastDebug({ mode: 'json', payload });
      }

      if (editing) {
        await AdministrationService.updateAdministration(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        await AdministrationService.createAdministration(payload, selectedFile);
        message.success('Created');
      }

      setIsModalOpen(false);
      form.resetFields();
      setSelectedFile(null);
      // revoke blob url if created
      if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) {
        try { URL.revokeObjectURL(previewUrl); } catch(e){}
      }
      setPreviewUrl(null);
      fetch();
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: t => <div style={{maxWidth:200, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Designation', dataIndex: 'designation', key: 'designation', render: t => <div style={{maxWidth:300, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (v) => v ? <Image src={v} width={60} /> : null },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Whatsapp', dataIndex: 'whatsapp', key: 'whatsapp' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Order', dataIndex: 'order', key: 'order' },
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
        <h3 style={{margin:0}}>Administration</h3>
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

      

      <Modal title={editing ? 'Edit Administration' : 'Create Administration'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{required:true, message:'Enter name'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="designation" label="Designation">
            <Input />
          </Form.Item>

          <Form.Item label="Image">
            <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
            {previewUrl && <div style={{marginTop:8}}><img src={previewUrl} alt="preview" style={{maxWidth:200}} /></div>}
          </Form.Item>

          <Form.Item name="contact" label="Contact">
            <Input />
          </Form.Item>

          <Form.Item name="whatsapp" label="Whatsapp">
            <Input />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>

          <Form.Item name="language" label="Language" initialValue="Marathi">
            <Select allowClear>
              <Option value="English">English</Option>
              <Option value="Marathi">Marathi</Option>
              <Option value="Hindi">Hindi</Option>
            </Select>
          </Form.Item>

          <Form.Item name="order" label="Order">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Administration" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Designation:</strong> {viewing.designation}</p>
            {viewing.image && <p><strong>Image:</strong><br/><img src={viewing.image} alt="admin" style={{maxWidth:200}}/></p>}
            <p><strong>Contact:</strong> {viewing.contact}</p>
            <p><strong>Whatsapp:</strong> {viewing.whatsapp}</p>
            <p><strong>Tags:</strong> {viewing.tags}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>Order:</strong> {viewing.order}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Administration;
