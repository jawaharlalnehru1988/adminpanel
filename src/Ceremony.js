import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import CeremonyService from './services/CeremonyService';

const Ceremony = () => {
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
      const res = await CeremonyService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load ceremonies');
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
      ceremony_id: record.ceremony_id,
      title: record.title,
      description: record.description,
      order: record.order,
      language: record.language,
    });
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete ceremony',
      content: 'Are you sure?',
      async onOk() {
        try {
          await CeremonyService.deleteItem(id);
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
    formData.append('ceremony_id', values.ceremony_id || '');
    formData.append('title', values.title || '');
    formData.append('description', values.description || '');
    formData.append('order', values.order ?? 0);
    formData.append('language', values.language || '');
    if (coverFile) formData.append('cover_image', coverFile);

    setLoading(true);
    try {
      if (editing) {
        await CeremonyService.updateItem(editing.id, formData);
        message.success('Updated');
      } else {
        await CeremonyService.createItem(formData);
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
    { title: 'Ceremony ID', dataIndex: 'ceremony_id', key: 'ceremony_id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: (t) => <div style={{maxWidth:250, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Order', dataIndex: 'order', key: 'order' },
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
        <h3 style={{margin:0}}>Ceremonies</h3>
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

      <Modal title={editing ? 'Edit Ceremony' : 'Add Ceremony'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setCoverFile(null);}} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="ceremony_id" label="Ceremony ID" rules={[{required:true, message:'Enter ceremony ID'}]}>
            <Input placeholder="e.g. shivjayanti-2025" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
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
          <Form.Item name="order" label="Order">
            <InputNumber style={{width:'100%'}} />
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

      <Modal title="Ceremony Details" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Ceremony ID:</strong> {viewing.ceremony_id}</p>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Description:</strong> {viewing.description}</p>
            <p><strong>Cover Image:</strong> {viewing.cover_image ? <a href={viewing.cover_image} target="_blank" rel="noreferrer">View</a> : '-'}</p>
            <p><strong>Order:</strong> {viewing.order}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Ceremony;
