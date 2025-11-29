import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ComplaintService from './services/ComplaintService';

const { Option } = Select;

const Complaints = () => {
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
      const res = await ComplaintService.getComplaints();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load complaints');
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
      full_name: record.full_name,
      mobile_number: record.mobile_number,
      category: record.category,
      send_to: record.send_to,
      message: record.message,
      language: record.language,
      clientId: record.clientId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete complaint',
      content: 'Are you sure?',
      async onOk() {
        try {
          await ComplaintService.deleteComplaint(id);
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
      full_name: values.full_name,
      mobile_number: values.mobile_number,
      category: values.category || '',
      send_to: values.send_to || '',
      message: values.message || '',
      language: values.language || null,
      clientId: values.clientId || null,
    };

    setLoading(true);
    try {
      if (editing) {
        await ComplaintService.updateComplaint(editing.id, payload);
        message.success('Updated');
      } else {
        await ComplaintService.createComplaint(payload);
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
    { title: 'Name', dataIndex: 'full_name', key: 'full_name', render: t => <div style={{maxWidth:220, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Mobile', dataIndex: 'mobile_number', key: 'mobile_number' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Send To', dataIndex: 'send_to', key: 'send_to' },
    { title: 'Message', dataIndex: 'message', key: 'message', render: m => <div style={{maxWidth:300, whiteSpace:'normal'}}>{m}</div> },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at' },
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
        <h3 style={{margin:0}}>Complaints</h3>
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

      <Modal title={editing ? 'Edit Complaint' : 'Create Complaint'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="full_name" label="Full Name" rules={[{required:true, message:'Enter name'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="mobile_number" label="Mobile Number" rules={[{required:true, message:'Enter mobile number'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Select allowClear>
              <Option value="electricity">Electricity</Option>
              <Option value="water">Water</Option>
              <Option value="roads">Roads</Option>
              <Option value="sanitation">Sanitation</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="send_to" label="Send To">
            <Select allowClear>
              <Option value="administration">Administration</Option>
              <Option value="panchayat">Panchayat</Option>
              <Option value="department">Department</Option>
            </Select>
          </Form.Item>

          <Form.Item name="message" label="Message">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="language" label="Language">
            <Select allowClear>
              <Option value="en">English</Option>
              <Option value="Marathi">Marathi</Option>
              <Option value="hi">Hindi</Option>
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

      <Modal title="Complaint" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.full_name}</p>
            <p><strong>Mobile:</strong> {viewing.mobile_number}</p>
            <p><strong>Category:</strong> {viewing.category}</p>
            <p><strong>Send To:</strong> {viewing.send_to}</p>
            <p><strong>Message:</strong><br/>{viewing.message}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
            <p><strong>Created At:</strong> {viewing.created_at}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
