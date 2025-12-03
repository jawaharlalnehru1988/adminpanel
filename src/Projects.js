import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Upload, InputNumber, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import ProjectService from './services/ProjectService';

const { Option } = Select;
const { TextArea } = Input;

const Projects = () => {
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
      const res = await ProjectService.getProjects();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load projects');
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
      progress: record.progress,
      status: record.status,
      location: record.location,
      start_date: record.start_date,
      end_date: record.end_date,
      is_featured: record.is_featured,
      language: record.language,
    });
    setSelectedFile(null);
    setPreviewUrl(record.cover_image || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete project',
      content: 'Are you sure?',
      async onOk() {
        try {
          await ProjectService.deleteProject(id);
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
      title: values.title,
      description: values.description || '',
      progress: values.progress || 0,
      status: values.status || '',
      location: values.location || '',
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      is_featured: values.is_featured || false,
      language: values.language || null,
    };

    setLoading(true);
    try {
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(payload).forEach((k) => fd.append(k, payload[k]));
        fd.append('cover_image', selectedFile);
        const debug = { mode: 'multipart', entries: [] };
        for (const pair of fd.entries()) debug.entries.push([pair[0], pair[1] && pair[1].name ? pair[1].name : typeof pair[1]]);
        setLastDebug(debug);
      } else {
        setLastDebug({ mode: 'json', payload });
      }

      if (editing) {
        await ProjectService.updateProject(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        if (!selectedFile) {
          message.error('Please upload a cover image');
          setLoading(false);
          return;
        }
        await ProjectService.createProject(payload, selectedFile);
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
    { title: 'Progress', dataIndex: 'progress', key: 'progress', render: p => <div>{p}%</div> },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Cover', dataIndex: 'cover_image', key: 'cover_image', render: (v) => v ? <img src={v} alt="cover" style={{maxWidth:80, maxHeight:60}} crossOrigin="anonymous" /> : null },
    { title: 'Location', dataIndex: 'location', key: 'location' },
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
        <h3 style={{margin:0}}>Projects</h3>
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

      <Modal title={editing ? 'Edit Project' : 'Create Project'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="progress" label="Progress (%)">
            <InputNumber min={0} max={100} style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select allowClear>
                 <Option value="proposed">Proposed</Option>
                 <Option value="ongoing">Ongoing</Option>
                 <Option value="completed">Completed</Option>
                 <Option value="on-hold">On Hold</Option>
                 <Option value="cancelled">Cancelled</Option>
                 <Option value="under-review">Under Review</Option>
                 <Option value="planning-phase">Planning Phase</Option>
                 <Option value="implementation-phase">Implementation Phase</Option>
            </Select>
          </Form.Item>

            

          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>

          <Form.Item name="start_date" label="Start Date">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="end_date" label="End Date">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="is_featured" label="Featured">
            <Switch />
          </Form.Item>

          <Form.Item label="Cover Image">
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

      <Modal title="Project" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            <p><strong>Progress:</strong> {viewing.progress}%</p>
            <p><strong>Status:</strong> {viewing.status}</p>
            {viewing.cover_image && <p><strong>Cover:</strong><br/><img src={viewing.cover_image} alt="cover" style={{maxWidth:400}} crossOrigin="anonymous"/></p>}
            <p><strong>Location:</strong> {viewing.location}</p>
            <p><strong>Start Date:</strong> {viewing.start_date || 'N/A'}</p>
            <p><strong>End Date:</strong> {viewing.end_date || 'N/A'}</p>
            <p><strong>Featured:</strong> {viewing.is_featured ? 'Yes' : 'No'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;
