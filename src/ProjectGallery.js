import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Upload, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ProjectGalleryService from './services/ProjectGalleryService';
import ProjectService from './services/ProjectService';

const { Option } = Select;
const { TextArea } = Input;

const ProjectGallery = () => {
  const [list, setList] = useState([]);
  const [projects, setProjects] = useState([]);
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
      const res = await ProjectGalleryService.getProjectGallery();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load project gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await ProjectService.getProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetch(); fetchProjects(); }, []);

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
      image_type: record.image_type,
      order: record.order,
      language: record.language,
      project: record.project,
    });
    setSelectedFile(null);
    setPreviewUrl(record.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete gallery image',
      content: 'Are you sure?',
      async onOk() {
        try {
          await ProjectGalleryService.deleteProjectGallery(id);
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
    const payload = {
      title: values.title || '',
      description: values.description || '',
      image_type: values.image_type || 'before',
      order: values.order || 0,
      language: values.language || null,
      project: values.project || null,
    };

    setLoading(true);
    try {
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
        await ProjectGalleryService.updateProjectGallery(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        if (!selectedFile) {
          message.error('Please upload an image');
          setLoading(false);
          return;
        }
        await ProjectGalleryService.createProjectGallery(payload, selectedFile);
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
    { title: 'Title', dataIndex: 'title', key: 'title', render: t => <div style={{maxWidth:240, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Type', dataIndex: 'image_type', key: 'image_type' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (v) => v ? <img src={v} alt="img" style={{maxWidth:120, maxHeight:80}} crossOrigin="anonymous"/> : null },
    { title: 'Order', dataIndex: 'order', key: 'order' },
    { title: 'Project', dataIndex: 'project', key: 'project', render: (p) => p ? p : null },
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
        <h3 style={{margin:0}}>Project Gallery</h3>
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

      <Modal title={editing ? 'Edit Gallery Item' : 'Create Gallery Item'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="image_type" label="Image Type">
            <Select>
              <Option value="before">Before</Option>
              <Option value="during">During</Option>
              <Option value="after">After</Option>
            </Select>
          </Form.Item>

          <Form.Item name="order" label="Order">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="project" label="Project">
            <Select showSearch optionFilterProp="children" allowClear placeholder="Select project">
              {projects.map(p => <Option key={p.id} value={p.id}>{p.title}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Image">
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Gallery Item" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            <p><strong>Type:</strong> {viewing.image_type}</p>
            {viewing.image && <p><strong>Image:</strong><br/><img src={viewing.image} alt="img" style={{maxWidth:600}} crossOrigin="anonymous"/></p>}
            <p><strong>Order:</strong> {viewing.order}</p>
            <p><strong>Project:</strong> {viewing.project}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectGallery;
