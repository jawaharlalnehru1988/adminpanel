import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import FinancialReportsService from './services/FinancialReportsService';
import FinancialYearService from './services/FinancialYearService';

const FINANCETAG_CHOICES = [
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' },
];

const FinancialReports = () => {
  const [list, setList] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [form] = Form.useForm();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await FinancialReportsService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load financial reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    try {
      const res = await FinancialYearService.getFinancialYears();
      setYears(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load financial years');
    }
  };

  useEffect(() => { fetch(); fetchYears(); }, []);

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
      financial_year: record.financial_year,
      amount: record.amount,
      received_amount: record.received_amount,
      spent_amount: record.spent_amount,
      balance_amount: record.balance_amount,
      tag: record.tag,
      language: record.language,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete financial report',
      content: 'Are you sure?',
      async onOk() {
        try {
          await FinancialReportsService.deleteItem(id);
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
      title: values.title || '',
      percentage: values.percentage || null,
      financial_year: values.financial_year || null,
      amount: values.amount || null,
      received_amount: values.received_amount || null,
      spent_amount: values.spent_amount || null,
      balance_amount: values.balance_amount || null,
      tag: values.tag || '',
      language: values.language || '',
    };

    setLoading(true);
    try {
      if (editing) {
        await FinancialReportsService.updateItem(editing.id, payload);
        message.success('Updated');
      } else {
        await FinancialReportsService.createItem(payload);
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

  const getYearName = (id) => {
    const y = years.find(x => x.id === id);
    return y ? y.name || y.year_name || id : id;
  };

  const getTagLabel = (tag) => {
    const t = FINANCETAG_CHOICES.find(x => x.value === tag);
    return t ? t.label : tag;
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: v => v ? `${v}%` : '-' },
    { title: 'Financial Year', dataIndex: 'financial_year', key: 'financial_year', render: v => getYearName(v) },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag', render: v => getTagLabel(v) },
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
        <h3 style={{margin:0}}>Financial Reports</h3>
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

      <Modal title={editing ? 'Edit Financial Report' : 'Add Financial Report'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{required:true, message:'Enter title'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="percentage" label="Percentage">
            <InputNumber style={{width:'100%'}} precision={2} min={0} max={100} />
          </Form.Item>
          <Form.Item name="financial_year" label="Financial Year" rules={[{required:true, message:'Select year'}]}>
            <Select placeholder="Select year" options={years.map(y=>({label:y.name||y.year_name, value:y.id}))} />
          </Form.Item>
          <Form.Item name="amount" label="Amount">
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>
          <Form.Item name="received_amount" label="Received Amount">
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>
          <Form.Item name="spent_amount" label="Spent Amount">
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>
          <Form.Item name="balance_amount" label="Balance Amount">
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>
          <Form.Item name="tag" label="Tag">
            <Select allowClear placeholder="Select tag" options={FINANCETAG_CHOICES} />
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

      <Modal title="Financial Report Details" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Title:</strong> {viewing.title}</p>
            <p><strong>Percentage:</strong> {viewing.percentage ? `${viewing.percentage}%` : '-'}</p>
            <p><strong>Financial Year:</strong> {getYearName(viewing.financial_year)}</p>
            <p><strong>Amount:</strong> {viewing.amount}</p>
            <p><strong>Received Amount:</strong> {viewing.received_amount}</p>
            <p><strong>Spent Amount:</strong> {viewing.spent_amount}</p>
            <p><strong>Balance Amount:</strong> {viewing.balance_amount}</p>
            <p><strong>Tag:</strong> {getTagLabel(viewing.tag)}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinancialReports;
