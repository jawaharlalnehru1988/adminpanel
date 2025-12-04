import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import DonationService from './services/DonationService';

const { Option } = Select;

const Donations = () => {
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
      const res = await DonationService.getDonations();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load donations');
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
      role_label: record.role_label,
      donor_name: record.donor_name,
      amount_label: record.amount_label,
      amount: record.amount,
      description: record.description,
      language: record.language,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete donation',
      content: 'Are you sure?',
      async onOk() {
        try {
          await DonationService.deleteDonation(id);
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
      role_label: values.role_label || '',
      donor_name: values.donor_name || '',
      amount_label: values.amount_label || '',
      amount: values.amount || null,
      description: values.description || '',
      language: values.language || '',
    };

    setLoading(true);
    try {
      if (editing) {
        await DonationService.updateDonation(editing.id, payload);
        message.success('Updated');
      } else {
        await DonationService.createDonation(payload);
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
    { title: 'Role Label', dataIndex: 'role_label', key: 'role_label' },
    { title: 'Donor Name', dataIndex: 'donor_name', key: 'donor_name', render: t => <div style={{maxWidth:220, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Amount Label', dataIndex: 'amount_label', key: 'amount_label' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: d => <div style={{maxWidth:300, whiteSpace:'normal'}}>{d}</div> },
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
        <h3 style={{margin:0}}>Donations</h3>
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

      <Modal title={editing ? 'Edit Donation' : 'Create Donation'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="role_label" label="Role Label">
            <Input />
          </Form.Item>

          <Form.Item name="donor_name" label="Donor Name" rules={[{ required: true, message: 'Please enter donor name' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="amount_label" label="Amount Label">
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="language" label="Language" initialValue="Marathi">
            <Select placeholder="Select Language">
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

      <Modal title="Donation Details" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Role Label:</strong> {viewing.role_label}</p>
            <p><strong>Donor Name:</strong> {viewing.donor_name}</p>
            <p><strong>Amount Label:</strong> {viewing.amount_label}</p>
            <p><strong>Amount:</strong> {viewing.amount}</p>
            <p><strong>Description:</strong><br/>{viewing.description}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Donations;
