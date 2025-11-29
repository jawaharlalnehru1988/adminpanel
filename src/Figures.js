import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import FigureService from './services/FigureService';

const Figures = () => {
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
      const res = await FigureService.getFigures();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load figures');
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
      name: record.name,
      value: record.value,
      unit: record.unit,
      icon: record.icon,
      order: record.order,
      language: record.language || undefined,
      clientId: record.clientId || undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete figure',
      content: 'Are you sure?',
      async onOk() {
        try {
          await FigureService.deleteFigure(id);
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
      name: values.name,
      value: values.value,
      unit: values.unit || null,
      icon: values.icon || null,
      order: values.order || 0,
      language: values.language || null,
      clientId: values.clientId || null,
    };

    setLoading(true);
    try {
      if (editing) {
        await FigureService.updateFigure(editing.id, payload);
        message.success('Updated');
      } else {
        await FigureService.createFigure(payload);
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
    { title: 'Name', dataIndex: 'name', key: 'name', render: t => <div style={{maxWidth:200, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Order', dataIndex: 'order', key: 'order' },
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
        <h3 style={{margin:0}}>Figures / Key Numbers</h3>
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

      <Modal title={editing ? 'Edit Figure' : 'Create Figure'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{required:true, message:'Enter name'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="Value" rules={[{required:true, message:'Enter value'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Unit">
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="Icon (optional)">
            <Input placeholder="Icon class or url" />
          </Form.Item>
          <Form.Item name="order" label="Order">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>
          <Form.Item name="language" label="Language">
            <Select allowClear options={[{label:'English', value:'English'},{label:'Marathi', value:'Marathi'},{label:'Hindi', value:'Hindi'}]} />
          </Form.Item>
          <Form.Item name="clientId" label="ClientId">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Figure" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Value:</strong> {viewing.value}</p>
            <p><strong>Unit:</strong> {viewing.unit}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>Order:</strong> {viewing.order}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Figures;
