import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Switch, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AnnouncementService from './services/AnnouncementService';
import dayjs from 'dayjs';

const Announcement = () => {
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
      const res = await AnnouncementService.getAnnouncements();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load announcements');
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
      message: record.message,
      date: record.date ? dayjs(record.date) : null,
      is_active: !!record.is_active,
      language: record.language || undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete announcement',
      content: 'Are you sure?',
      async onOk() {
        try {
          await AnnouncementService.deleteAnnouncement(id);
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
      message: values.message,
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      is_active: !!values.is_active,
      language: values.language || null,
    };

    setLoading(true);
    try {
      if (editing) {
        await AnnouncementService.updateAnnouncement(editing.id, payload);
        message.success('Updated');
      } else {
        await AnnouncementService.createAnnouncement(payload);
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
    { title: 'Message', dataIndex: 'message', key: 'message', render: (t) => <div style={{maxWidth:300, whiteSpace: 'normal'}}>{t}</div> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Active', dataIndex: 'is_active', key: 'is_active', render: v => v ? 'Yes' : 'No' },
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
        <h3 style={{margin:0}}>Announcements</h3>
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

      <Modal title={editing ? 'Edit Announcement' : 'Create Announcement'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="message" label="Message" rules={[{required:true, message:'Enter message'}]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="language" label="Language">
            <Select allowClear options={[{label:'English', value:'English'},{label:'Marathi', value:'Marathi'},{label:'Hindi', value:'Hindi'}]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Announcement" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Message:</strong> {viewing.message}</p>
            <p><strong>Date:</strong> {viewing.date}</p>
            <p><strong>Active:</strong> {viewing.is_active ? 'Yes' : 'No'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Announcement;
