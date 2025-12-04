import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import DigitalLibraryService from './services/DigitalLibraryService';
// Note: API calls left as TODOs. A stub service exists at `src/services/DigitalLibraryService.js`.

const DigitalLibrary = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form] = Form.useForm();
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: replace with real API call
      const res = await DigitalLibraryService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load digital library items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setCoverFile(null);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      language: record.language,
    });
    setCoverFile(null);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete item',
      content: 'Are you sure?',
      async onOk() {
        try {
          // TODO: replace with real API call
          await DigitalLibraryService.deleteItem(id);
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
    formData.append('name', values.name);
    formData.append('description', values.description || '');
    formData.append('language', values.language || '');
    if (coverFile) formData.append('cover_image', coverFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    setLoading(true);
    try {
      console.log('DigitalLibrary payload (not sent):', Object.fromEntries(formData));
      if (editing) {
        // TODO: replace with real API call
        await DigitalLibraryService.updateItem(editing.id, formData);
        message.success('Updated');
      } else {
        // TODO: replace with real API call
        await DigitalLibraryService.createItem(formData);
        message.success('Created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setCoverFile(null);
      setPdfFile(null);
      fetch();
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (t) => <div style={{maxWidth:300, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Created at', dataIndex: 'created_at', key: 'created_at' },
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
        <h3 style={{margin:0}}>Digital Library</h3>
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

      <Modal title={editing ? 'Edit Item' : 'Add Item'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setCoverFile(null); setPdfFile(null);}} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{required:true, message:'Enter name'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item label="Cover image">
            <Upload
              beforeUpload={(file) => { setCoverFile(file); return false; }}
              onRemove={() => setCoverFile(null)}
              fileList={coverFile ? [coverFile] : []}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Pdf">
            <Upload
              beforeUpload={(file) => { setPdfFile(file); return false; }}
              onRemove={() => setPdfFile(null)}
              fileList={pdfFile ? [pdfFile] : []}
              maxCount={1}
              accept=".pdf"
            >
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="language" label="Language" initialValue="Marathi">
            <Select allowClear options={[{label:'English', value:'English'},{label:'Marathi', value:'Marathi'},{label:'Hindi', value:'Hindi'}]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Digital Library Item" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            <p><strong>Cover image:</strong> {viewing.cover_image ? <a href={viewing.cover_image} target="_blank" rel="noreferrer">View</a> : '-'}</p>
            <p><strong>Pdf:</strong> {viewing.pdf ? <a href={viewing.pdf} target="_blank" rel="noreferrer">Download</a> : '-'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>Created at:</strong> {viewing.created_at || '-'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DigitalLibrary;