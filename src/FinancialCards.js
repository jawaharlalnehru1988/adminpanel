import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import FinancialCardsService from './services/FinancialCardsService';
import FinancialYearService from './services/FinancialYearService';

const FINANCETAG_CHOICES = [
  { label: 'Income', value: 'Income' },
  { label: 'Expense', value: 'Expense' },
];

const FinancialCards = () => {
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
      const res = await FinancialCardsService.getItems();
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load financial cards');
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
      tag: record.tag,
      amount: record.amount,
      financial_year: record.financial_year,
      language: record.language,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete financial card',
      content: 'Are you sure?',
      async onOk() {
        try {
          await FinancialCardsService.deleteItem(id);
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
      tag: values.tag || '',
      amount: values.amount || 0,
      financial_year: values.financial_year || null,
      language: values.language || '',
    };

    setLoading(true);
    try {
      if (editing) {
        await FinancialCardsService.updateItem(editing.id, payload);
        message.success('Updated');
      } else {
        await FinancialCardsService.createItem(payload);
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
    { title: 'Tag', dataIndex: 'tag', key: 'tag', render: v => getTagLabel(v) },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Financial Year', dataIndex: 'financial_year', key: 'financial_year', render: v => getYearName(v) },
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
        <h3 style={{margin:0}}>Financial Cards</h3>
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

      <Modal title={editing ? 'Edit Financial Card' : 'Add Financial Card'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="tag" label="Tag" rules={[{required:true, message:'Select tag'}]}>
            <Select placeholder="Select tag" options={FINANCETAG_CHOICES} />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{required:true, message:'Enter amount'}]}>
            <InputNumber style={{width:'100%'}} precision={2} />
          </Form.Item>
          <Form.Item name="financial_year" label="Financial Year">
            <Select allowClear placeholder="Select year" options={years.map(y=>({label:y.name||y.year_name, value:y.id}))} />
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

      <Modal title="Financial Card Details" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}>
        {viewing && (
          <div>
            <p><strong>Tag:</strong> {getTagLabel(viewing.tag)}</p>
            <p><strong>Amount:</strong> {viewing.amount}</p>
            <p><strong>Financial Year:</strong> {getYearName(viewing.financial_year)}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinancialCards;
