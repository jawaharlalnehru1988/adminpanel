import React, { useEffect, useState } from 'react';
import { Table, Button, Select, message, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ExpenditurePeriodService from './services/ExpenditurePeriodService';
import FinancialYearService from './services/FinancialYearService';

const { Option } = Select;

const ExpenditurePeriods = () => {
  const [list, setList] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [lastDebug, setLastDebug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetch = async (year = null) => {
    setLoading(true);
    try {
      const params = {};
      if (year) params.financial_year = year;
      const res = await ExpenditurePeriodService.getExpenditurePeriods(params);
      setList(res.data || []);
      setLastDebug({ params, count: (res.data || []).length });
    } catch (err) {
      console.error(err);
      message.error('Failed to load expenditure periods');
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
    }
  };

  useEffect(() => { fetch(selectedYear); fetchYears(); }, [selectedYear]);

  const openCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    const payload = {
      key: values.key || '',
      value: values.value || '',
      orders: values.orders || '',
      financial_year: values.financial_year || null,
    };
    setLoading(true);
    try {
      await ExpenditurePeriodService.createExpenditurePeriod(payload);
      message.success('Created');
      setIsModalOpen(false);
      fetch(selectedYear);
    } catch (err) {
      console.error(err);
      message.error('Create failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Key', dataIndex: 'key', key: 'key' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
    { title: 'Categories', dataIndex: 'categories', key: 'categories', render: (cats) => cats ? `${cats.length} items` : '0' },
  ];

  const expandedRowRender = (record) => {
    const cols = [
      { title: 'Label (EN)', dataIndex: 'label_en', key: 'label_en', render: (t) => <div style={{maxWidth:300, whiteSpace:'normal'}}>{t}</div> },
      { title: 'Label (MR)', dataIndex: 'label_mr', key: 'label_mr' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: p => <div>{p}%</div> },
      { title: 'Color', dataIndex: 'color', key: 'color', render: c => c ? <div style={{width:24,height:16,background:c,border:'1px solid #ccc'}} /> : null },
    ];
    return <Table columns={cols} dataSource={record.categories || []} pagination={false} rowKey={(r, i)=> r.label_en + i} />;
  };

  return (
    <div style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, gap:12}}>
        <h3 style={{margin:0}}>Expenditure Periods</h3>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <Select allowClear placeholder="Filter by financial year" style={{minWidth:220}} value={selectedYear} onChange={(v) => setSelectedYear(v)}>
            <Option value={null}>All</Option>
            {years.map(y => <Option key={y.id} value={y.id}>{y.label || y.name || y.year || y.id}</Option>)}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Period</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        loading={loading}
        expandable={{ expandedRowRender }}
        rowKey={(r, i) => r.key + i}
        pagination={{ pageSize: 10 }}
      />

      {lastDebug && (
        <div style={{marginTop:12, padding:12, background:'#f7f7f7', borderRadius:6}}>
          <strong>Debug:</strong>
          <pre style={{whiteSpace:'pre-wrap', marginTop:8}}>{JSON.stringify(lastDebug, null, 2)}</pre>
        </div>
      )}
      
      <Modal title="Create Expenditure Period" open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="key" label="Key" rules={[{required:true, message:'Enter key'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="value" label="Value">
            <Input />
          </Form.Item>

          <Form.Item name="orders" label="Orders">
            <Input />
          </Form.Item>

          <Form.Item name="financial_year" label="Financial Year">
            <Select allowClear placeholder="Select financial year">
              {years.map(y => <Option key={y.id} value={y.id}>{y.label || y.name || y.year || y.id}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Create</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenditurePeriods;