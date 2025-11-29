import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import IncomeCategoryService from './services/IncomeCategoryService';
import FinancialYearService from './services/FinancialYearService';

const { Option } = Select;

const IncomeCategories = () => {
  const [list, setList] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [lastDebug, setLastDebug] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [form] = Form.useForm();

  const fetch = async (year = null) => {
    setLoading(true);
    try {
      const params = {};
      if (year) params.financial_year = year;
      const res = await IncomeCategoryService.getCategories(params);
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load income categories');
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

  useEffect(() => { fetch(selectedYear); fetchYears(); }, []);
  useEffect(() => { fetch(selectedYear); }, [selectedYear]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      label_en: record.label_en,
      label_mr: record.label_mr,
      percentage: record.percentage,
      color: record.color,
      amount: record.amount,
      icon_color: record.icon_color,
      period: record.period,
      financial_year: record.financial_year,
    });
    setSelectedFile(null);
    setPreviewUrl(record.icon || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete income category',
      content: 'Are you sure?',
      async onOk() {
        try {
          await IncomeCategoryService.deleteCategory(id);
          message.success('Deleted');
          fetch(selectedYear);
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

  const beforeFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const allowed = ['image/jpeg','image/png','image/webp','image/svg+xml'];
    if (!allowed.includes(f.type)) { message.error('Invalid image type'); return; }
    if (f.size > 5*1024*1024) { message.error('Image too large'); return; }
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onFinish = async (values) => {
    const payload = {
      label_en: values.label_en || '',
      label_mr: values.label_mr || '',
      percentage: values.percentage || 0,
      color: values.color || '#000000',
      amount: values.amount || '0.00',
      icon_color: values.icon_color || null,
      period: values.period || null,
      financial_year: values.financial_year || null,
    };

    setLoading(true);
    try {
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(payload).forEach((k) => fd.append(k, payload[k]));
        fd.append('icon', selectedFile);
        const debug = { mode: 'multipart', entries: [] };
        for (const pair of fd.entries()) debug.entries.push([pair[0], pair[1] && pair[1].name ? pair[1].name : typeof pair[1]]);
        setLastDebug(debug);
      } else {
        setLastDebug({ mode: 'json', payload });
      }

      if (editing) {
        await IncomeCategoryService.updateCategory(editing.id, payload, selectedFile);
        message.success('Updated');
      } else {
        await IncomeCategoryService.createCategory(payload, selectedFile);
        message.success('Created');
      }

      setIsModalOpen(false);
      form.resetFields();
      setSelectedFile(null);
      if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} }
      setPreviewUrl(null);
      fetch(selectedYear);
    } catch (err) {
      console.error(err);
      message.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Label (EN)', dataIndex: 'label_en', key: 'label_en', render: t => <div style={{maxWidth:220, whiteSpace:'normal'}}>{t}</div> },
    { title: 'Label (MR)', dataIndex: 'label_mr', key: 'label_mr' },
    { title: 'Percentage', dataIndex: 'percentage', key: 'percentage', render: p => <div>{p}%</div> },
    { title: 'Color', dataIndex: 'color', key: 'color', render: c => c ? <div style={{width:24,height:16,background:c,border:'1px solid #ccc'}} /> : null },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Icon', dataIndex: 'icon', key: 'icon', render: (v) => v ? <img src={v} alt="icon" style={{maxWidth:40, maxHeight:40}} crossOrigin="anonymous"/> : null },
    { title: 'Period', dataIndex: 'period', key: 'period' },
    { title: 'Financial Year', dataIndex: 'financial_year', key: 'financial_year' },
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
        <h3 style={{margin:0}}>Income Categories</h3>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <Select allowClear placeholder="Filter by financial year" style={{minWidth:220}} value={selectedYear} onChange={(v) => setSelectedYear(v)}>
            <Option value={null}>All</Option>
            {years.map(y => <Option key={y.id} value={y.id}>{y.label || y.name || y.year || y.id}</Option>)}
          </Select>
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

      <Modal title={editing ? 'Edit Income Category' : 'Create Income Category'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields(); setSelectedFile(null); if (previewUrl && previewUrl.startsWith && previewUrl.startsWith('blob:')) { try { URL.revokeObjectURL(previewUrl); } catch(e){} } setPreviewUrl(null);}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="label_en" label="Label (EN)" rules={[{required:true, message:'Enter English label'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="label_mr" label="Label (MR)">
            <Input />
          </Form.Item>

          <Form.Item name="percentage" label="Percentage">
            <InputNumber min={0} max={100} style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="color" label="Color">
            <Input type="color" />
          </Form.Item>

          <Form.Item name="amount" label="Amount">
            <Input />
          </Form.Item>

          <Form.Item name="icon_color" label="Icon Color">
            <Input type="color" />
          </Form.Item>

          <Form.Item name="period" label="Period">
            <InputNumber style={{width:'100%'}} />
          </Form.Item>

          <Form.Item name="financial_year" label="Financial Year">
            <Select allowClear placeholder="Select financial year">
              {years.map(y => <Option key={y.id} value={y.id}>{y.label || y.name || y.year || y.id}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Icon">
            <input type="file" accept="image/*" onChange={beforeFile} />
            {previewUrl && <div style={{marginTop:8}}><img src={previewUrl} alt="preview" style={{maxWidth:200}} /></div>}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>{editing ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Income Category" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>]}> 
        {viewing && (
          <div>
            <p><strong>Label (EN):</strong> {viewing.label_en}</p>
            <p><strong>Label (MR):</strong> {viewing.label_mr}</p>
            <p><strong>Percentage:</strong> {viewing.percentage}%</p>
            <p><strong>Color:</strong> {viewing.color}</p>
            {viewing.icon && <p><strong>Icon:</strong><br/><img src={viewing.icon} alt="icon" style={{maxWidth:200}} crossOrigin="anonymous"/></p>}
            <p><strong>Amount:</strong> {viewing.amount}</p>
            <p><strong>Period:</strong> {viewing.period}</p>
            <p><strong>Financial Year:</strong> {viewing.financial_year}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IncomeCategories;
