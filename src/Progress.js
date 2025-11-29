import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ProgressService from './services/ProgressService';

const { Option } = Select;

const Progress = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form] = Form.useForm();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await ProgressService.getProgresses();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load progress items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      percentage: record.percentage,
      language: record.language,
      clientId: record.clientId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete progress item',
      content: 'Are you sure?',
      async onOk() {
        try {
          await ProgressService.deleteProgress(id);
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
    const payload = {
      title: values.title,
      percentage: values.percentage,
      language: values.language || null,
      clientId: values.clientId || null,
    };

    setLoading(true);
    try {
      if (editing) {
        await ProgressService.updateProgress(editing.id, payload);
        message.success('Updated');
      } else {
        await ProgressService.createProgress(payload);
        message.success('Created');
      }
      setIsModalOpen(false);
      form.resetFields();
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
    { title: 'Percentage', dataIndex: 'percentage', key: 'percentage' },
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
        <h3 style={{margin:0}}>Progress / Projects</h3>
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

      <Modal title={editing ? 'Edit Progress' : 'Create Progress'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="percentage" label="Percentage" rules={[{required:true, message:'Enter percentage'}]}>
            <InputNumber min={0} max={100} style={{width:'100%'}} />
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

      <Modal title="Progress" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Percentage:</strong> {viewing.percentage}%</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Progress;
