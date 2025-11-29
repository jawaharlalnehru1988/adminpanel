import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import DonationService from './services/DonationService';

const Donations = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [lastDebug, setLastDebug] = useState(null);
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
      role_label_en: record.role_label_en,
      donor_name: record.donor_name,
      donor_name_en: record.donor_name_en,
      amount_label: record.amount_label,
      amount_label_en: record.amount_label_en,
      amount_display: record.amount_display,
      amount: record.amount,
      description: record.description,
      description_en: record.description_en,
      language: record.language,
      clientId: record.clientId,
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
      role_label_en: values.role_label_en || '',
      donor_name: values.donor_name || '',
      donor_name_en: values.donor_name_en || '',
      amount_label: values.amount_label || '',
      amount_label_en: values.amount_label_en || '',
      amount_display: values.amount_display || '',
      amount: values.amount || null,
      description: values.description || '',
      description_en: values.description_en || '',
      language: values.language || null,
      clientId: values.clientId || null,
    };

    setLoading(true);
    try {
      setLastDebug({ mode: 'json', payload });
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
    { title: 'Donor', dataIndex: 'donor_name', key: 'donor_name', render: t => <div style={{maxWidth:220, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Amount', dataIndex: 'amount_display', key: 'amount_display' },
    { title: 'Amount (raw)', dataIndex: 'amount', key: 'amount' },
    { title: 'Description', dataIndex: 'description', key: 'description', render: d => <div style={{maxWidth:300, whiteSpace:'normal'}}>{d}</div> },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'ClientId', dataIndex: 'clientId', key: 'clientId' },
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

      {lastDebug && (
        <div style={{marginTop:12, padding:12, background:'#f7f7f7', borderRadius:6}}>
          <strong>Debug:</strong>
          <pre style={{whiteSpace:'pre-wrap', marginTop:8}}>{JSON.stringify(lastDebug, null, 2)}</pre>
        </div>
      )}

      <Modal title={editing ? 'Edit Donation' : 'Create Donation'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="role_label" label="Role Label">
            <Input />
          </Form.Item>

          <Form.Item name="role_label_en" label="Role Label (EN)">
            <Input />
          </Form.Item>

          <Form.Item name="donor_name" label="Donor Name">
            <Input />
          </Form.Item>

          <Form.Item name="donor_name_en" label="Donor Name (EN)">
            <Input />
          </Form.Item>

          <Form.Item name="amount_label" label="Amount Label">
            <Input />
          </Form.Item>

          <Form.Item name="amount_label_en" label="Amount Label (EN)">
            <Input />
          </Form.Item>

          <Form.Item name="amount_display" label="Amount Display">
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Amount (raw)">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="description_en" label="Description (EN)">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="language" label="Language">
            <Input />
          </Form.Item>

          <Form.Item name="clientId" label="ClientId">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Donation" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Donor:</strong> {viewing.donor_name}</p>
            <p><strong>Amount:</strong> {viewing.amount_display}</p>
            <p><strong>Amount (raw):</strong> {viewing.amount}</p>
            <p><strong>Description:</strong><br/>{viewing.description}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
            <p><strong>Created At:</strong> {viewing.created_at}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Donations;
