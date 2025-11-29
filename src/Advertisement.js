import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import AdvertisementService from './services/AdvertisementService';

const { Option } = Select;

const Advertisement = () => {
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
      const res = await AdvertisementService.getAdvertisements();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load advertisements');
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
      title: record.title,
      link: record.link,
      language: record.language,
      clientId: record.clientId,
    });
    setSelectedFile(null);
    setPreviewUrl(record.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete advertisement',
      content: 'Are you sure?',
      async onOk() {
        try {
          await AdvertisementService.deleteAdvertisement(id);
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      message.error('Invalid image type. Allowed: jpg, png, webp');
      return false;
    }
    if (file.size > maxSize) {
      message.error('Image must be smaller than 5MB');
      return false;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return false;
  };

  const onFinish = async (values) => {
    if (!selectedFile && !editing) {
      message.error('Please upload an image');
      return;
    }

    const payload = {
      title: values.title,
      link: values.link || '',
      language: values.language || null,
      clientId: values.clientId || null,
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
        await AdvertisementService.updateAdvertisement(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        await AdvertisementService.createAdvertisement(payload, selectedFile);
        message.success('Created');
      }

      setIsModalOpen(false);
      form.resetFields();
      setSelectedFile(null);
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
    { title: 'Title', dataIndex: 'title', key: 'title', render: t => <div style={{maxWidth:300, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (v) => v ? <Image src={v} width={80} /> : null },
    { title: 'Link', dataIndex: 'link', key: 'link', render: (v) => v ? <a href={v} target="_blank" rel="noopener noreferrer">{v.substring(0, 30)}...</a> : null },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'ClientId', dataIndex: 'clientId', key: 'clientId' },
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
        <h3 style={{margin:0}}>Advertisements</h3>
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

      {lastDebug && (
        <div style={{marginTop:12, padding:12, background:'#f7f7f7', borderRadius:6}}>
          <strong>Debug:</strong>
          <pre style={{whiteSpace:'pre-wrap', marginTop:8}}>{JSON.stringify(lastDebug, null, 2)}</pre>
        </div>
      )}

      <Modal title={editing ? 'Edit Advertisement' : 'Create Advertisement'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="link" label="Link (URL)">
            <Input type="url" placeholder="https://example.com" />
          </Form.Item>

          <Form.Item label="Image" rules={!editing ? [{required:true, message:'Upload an image'}] : []}>
            <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
            {previewUrl && <div style={{marginTop:8}}><img src={previewUrl} alt="preview" style={{maxWidth:200}} /></div>}
          </Form.Item>

          <Form.Item name="language" label="Language">
            <Select allowClear>
              <Option value="English">English</Option>
              <Option value="Marathi">Marathi</Option>
              <Option value="Hindi">Hindi</Option>
            </Select>
          </Form.Item>

          <Form.Item name="clientId" label="ClientId">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Advertisement" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            {viewing.image && <p><strong>Image:</strong><br/><img src={viewing.image} alt="ad" style={{maxWidth:300}}/></p>}
            <p><strong>Link:</strong> {viewing.link ? <a href={viewing.link} target="_blank" rel="noopener noreferrer">{viewing.link}</a> : 'N/A'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Advertisement;
