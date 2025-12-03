import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import VillageService from './services/VillageService';

const { TextArea } = Input;
const { Option } = Select;

const VillageInfo = () => {
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
      const res = await VillageService.getVillageInfos();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load village info');
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
      description: record.description,
      order: record.order,
      tags: record.tags,
      language: record.language,
    });
    setSelectedFile(null);
    setPreviewUrl(record.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete entry',
      content: 'Are you sure?',
      async onOk() {
        try {
          await VillageService.deleteVillageInfo(id);
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
    return false; // prevent default upload
  };

  const onFinish = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      order: values.order != null ? values.order : 0,
      tags: values.tags || '',
      language: values.language || null,
    };

    setLoading(true);
    try {
        // capture debug info
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
          await VillageService.updateVillageInfo(editing.id, payload, selectedFile);
          message.success('Updated');
        } else {
          await VillageService.createVillageInfo(payload, selectedFile);
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
    { title: 'Order', dataIndex: 'order', key: 'order' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (v) => v ? <Image src={v} width={80} /> : null },
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
        <h3 style={{margin:0}}>Village Info</h3>
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
      

      <Modal title={editing ? 'Edit Village Info' : 'Create Village Info'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item label="Image">
            <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
            {previewUrl && <div style={{marginTop:8}}><img src={previewUrl} alt="preview" style={{maxWidth:200}} /></div>}
          </Form.Item>

          <Form.Item name="order" label="Order">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>

          <Form.Item name="language" label="Language">
            <Select allowClear>
              <Option value="English">English</Option>
              <Option value="Marathi">Marathi</Option>
              <Option value="Hindi">Hindi</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Village Info" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <h4>{viewing.title}</h4>
            {viewing.image && <p><img src={viewing.image} alt="cover" style={{maxWidth:300}}/></p>}
            <div dangerouslySetInnerHTML={{__html: viewing.description}} />
            <p><strong>Tags:</strong> {viewing.tags}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>Order:</strong> {viewing.order}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VillageInfo;
