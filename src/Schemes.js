import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import SchemeService from './services/SchemeService';

const { Option } = Select;
const { TextArea } = Input;

const Schemes = () => {
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
      const res = await SchemeService.getSchemes();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load schemes');
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
      level: record.level,
      description: record.description,
      data_top: record.data_top,
      data_bottom: record.data_bottom,
      value_top: record.value_top,
      value_bottom: record.value_bottom,
      gr_download_link: record.gr_download_link,
      beneficiaries_link: record.beneficiaries_link,
      website_link: record.website_link,
      apply_link: record.apply_link,
      language: record.language,
    });
    setSelectedFile(null);
    setPreviewUrl(record.icon || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete scheme',
      content: 'Are you sure?',
      async onOk() {
        try {
          await SchemeService.deleteScheme(id);
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
      level: values.level || '',
      description: values.description || '',
      data_top: values.data_top || '',
      data_bottom: values.data_bottom || '',
      value_top: values.value_top || '',
      value_bottom: values.value_bottom || '',
      gr_download_link: values.gr_download_link || '',
      beneficiaries_link: values.beneficiaries_link || '',
      website_link: values.website_link || '',
      apply_link: values.apply_link || '',
      language: values.language || null,
    };

    setLoading(true);
    try {
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(payload).forEach((k) => fd.append(k, payload[k]));
        fd.append('icon', selectedFile);
        const debug = { mode: 'multipart', entries: [] };
        for (const pair of fd.entries()) debug.entries.push([pair[0], pair[1] && pair[1].name ? pair[1].name : typeof pair[1]]);
        setLastDebug(debug);
      } else {
        setLastDebug({ mode: 'json', payload });
      }

      if (editing) {
        await SchemeService.updateScheme(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        await SchemeService.createScheme(payload, selectedFile);
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
    { title: 'Title', dataIndex: 'title', key: 'title', render: t => <div style={{maxWidth:200, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Level', dataIndex: 'level', key: 'level' },
    { title: 'Icon', dataIndex: 'icon', key: 'icon', render: (v) => v ? <img src={v} alt="icon" style={{maxWidth:50, maxHeight:50}} crossOrigin="anonymous" /> : null },
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
        <h3 style={{margin:0}}>Schemes</h3>
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

      <Modal title={editing ? 'Edit Scheme' : 'Create Scheme'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="level" label="Level">
            <Select allowClear placeholder="Select level">
              <Option value="national">National</Option>
              <Option value="state">State</Option>
              <Option value="local">Local</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="data_top" label="Data Top (Label)">
            <Input />
          </Form.Item>

          <Form.Item name="value_top" label="Value Top">
            <Input />
          </Form.Item>

          <Form.Item name="data_bottom" label="Data Bottom (Label)">
            <Input />
          </Form.Item>

          <Form.Item name="value_bottom" label="Value Bottom">
            <Input />
          </Form.Item>

          <Form.Item name="gr_download_link" label="GR Download Link">
            <Input type="url" placeholder="https://..." />
          </Form.Item>

          <Form.Item name="beneficiaries_link" label="Beneficiaries Link">
            <Input type="url" placeholder="https://..." />
          </Form.Item>

          <Form.Item name="website_link" label="Website Link">
            <Input type="url" placeholder="https://..." />
          </Form.Item>

          <Form.Item name="apply_link" label="Apply Link">
            <Input type="url" placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Icon (Image)">
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

      <Modal title="Scheme" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Level:</strong> {viewing.level}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            {viewing.icon && <p><strong>Icon:</strong><br/><img src={viewing.icon} alt="icon" style={{maxWidth:150}} crossOrigin="anonymous" /></p>}
            <p><strong>Data Top:</strong> {viewing.data_top}</p>
            <p><strong>Value Top:</strong> {viewing.value_top}</p>
            <p><strong>Data Bottom:</strong> {viewing.data_bottom}</p>
            <p><strong>Value Bottom:</strong> {viewing.value_bottom}</p>
            <p><strong>GR Download Link:</strong> {viewing.gr_download_link ? <a href={viewing.gr_download_link} target="_blank" rel="noopener noreferrer">{viewing.gr_download_link}</a> : 'N/A'}</p>
            <p><strong>Beneficiaries Link:</strong> {viewing.beneficiaries_link ? <a href={viewing.beneficiaries_link} target="_blank" rel="noopener noreferrer">{viewing.beneficiaries_link}</a> : 'N/A'}</p>
            <p><strong>Website Link:</strong> {viewing.website_link ? <a href={viewing.website_link} target="_blank" rel="noopener noreferrer">{viewing.website_link}</a> : 'N/A'}</p>
            <p><strong>Apply Link:</strong> {viewing.apply_link ? <a href={viewing.apply_link} target="_blank" rel="noopener noreferrer">{viewing.apply_link}</a> : 'N/A'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Schemes;
