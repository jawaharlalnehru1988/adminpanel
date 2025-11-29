import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ProgrammeService from './services/ProgrammeService';
import dayjs from 'dayjs';

const ProgrammeHighlights = () => {
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
      const res = await ProgrammeService.getProgrammes();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load programme highlights');
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
      date: record.date ? dayjs(record.date) : null,
      type: record.type,
      link: record.link,
      language: record.language || undefined,
      clientId: record.clientId || undefined,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete programme highlight',
      content: 'Are you sure?',
      async onOk() {
        try {
          await ProgrammeService.deleteProgramme(id);
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
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      type: values.type,
      link: values.link || null,
      language: values.language || null,
      clientId: values.clientId || null,
    };

    setLoading(true);
    try {
      if (editing) {
        await ProgrammeService.updateProgramme(editing.id, payload);
        message.success('Updated');
      } else {
        await ProgrammeService.createProgramme(payload);
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
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Link', dataIndex: 'link', key: 'link', render: l => l ? <a href={l} target="_blank" rel="noreferrer">Link</a> : null },
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
        <h3 style={{margin:0}}>Programme Highlights</h3>
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

      <Modal title={editing ? 'Edit Programme Highlight' : 'Create Programme Highlight'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker style={{width:'100%'}} />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Select options={[{label:'Meet', value:'Meet'},{label:'Event', value:'Event'},{label:'Other', value:'Other'}]} allowClear />
          </Form.Item>
          <Form.Item name="link" label="Link">
            <Input />
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

      <Modal title="Programme Highlight" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Date:</strong> {viewing.date}</p>
            <p><strong>Type:</strong> {viewing.type}</p>
            <p><strong>Link:</strong> {viewing.link ? <a href={viewing.link} target="_blank" rel="noreferrer">{viewing.link}</a> : '—'}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProgrammeHighlights;
