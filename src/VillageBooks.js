import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import VillageBooksService from './services/VillageBooksService';

const VillageBooks = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form] = Form.useForm();
  const [coverFile, setCoverFile] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await VillageBooksService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load village books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setCoverFile(null);
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
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete item',
      content: 'Are you sure?',
      async onOk() {
        try {
          await VillageBooksService.deleteItem(id);
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

    setLoading(true);
    try {
      if (editing) {
        await VillageBooksService.updateItem(editing.id, formData);
        message.success('Updated');
      } else {
        await VillageBooksService.createItem(formData);
        message.success('Created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setCoverFile(null);
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
        <h3 style={{margin:0}}>Village Books</h3>
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

      <Modal title={editing ? 'Edit Village Book' : 'Add Village Book'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setCoverFile(null);}} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{required:true, message:'Enter name'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={(file) => { setCoverFile(file); return false; }}
              onRemove={() => setCoverFile(null)}
              fileList={coverFile ? [coverFile] : []}
              maxCount={1}
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

      <Modal title="Village Book Details" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            <p><strong>Cover Image:</strong> {viewing.cover_image ? <a href={viewing.cover_image} target="_blank" rel="noreferrer">View</a> : '-'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VillageBooks;
