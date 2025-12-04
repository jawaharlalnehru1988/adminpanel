import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import FinancialYearService from './services/FinancialYearService'
import BudgetSummaryService from './services/BudgetSummaryService'
// Note: API calls for budget summaries are left as TODOs. A stub service exists at `src/services/BudgetSummaryService.js`.

const BudgetSummary = () => {
  const [list, setList] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [form] = Form.useForm()

  const fetch = async () => {
    setLoading(true)
    try {
      // TODO: replace with real API call
      const res = await BudgetSummaryService.getBudgetSummaries()
      setList(res.data || [])
    } catch (err) {
      console.error(err)
      message.error('Failed to load budget summaries')
    } finally {
      setLoading(false)
    }
  }

  const fetchYears = async () => {
    try {
      const res = await FinancialYearService.getFinancialYears()
      setYears(res.data || [])
    } catch (err) {
      console.error(err)
      message.error('Failed to load financial years')
    }
  }

  useEffect(() => { fetch(); fetchYears(); }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      year: record.year,
      total_budget: record.total_budget,
      total_income: record.total_income,
      total_expense: record.total_expense,
      balance: record.balance,
      language: record.language,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete budget summary',
      content: 'Are you sure?',
      async onOk() {
        try {
          // TODO: replace with real API call
          await BudgetSummaryService.deleteBudgetSummary(id)
          message.success('Deleted')
          fetch()
        } catch (err) {
          console.error(err)
          message.error('Delete failed')
        }
      }
    })
  }

  const handleView = (record) => {
    setViewing(record)
    setIsViewOpen(true)
  }

  const onFinish = async (values) => {
    const payload = {
      year: values.year,  // ID of the financial year
      total_budget: values.total_budget || '',
      total_income: values.total_income || '',
      total_expense: values.total_expense || '',
      balance: values.balance || '',
      language: values.language || '',
    }

    setLoading(true)
    try {
      console.log('BudgetSummary payload:', payload)
      if (editing) {
        // TODO: replace with real API call
        await BudgetSummaryService.updateBudgetSummary(editing.id, payload)
        message.success('Updated')
      } else {
        // TODO: replace with real API call
        await BudgetSummaryService.createBudgetSummary(payload)
        message.success('Created')
      }
      setIsModalOpen(false)
      form.resetFields()
      fetch()
    } catch (err) {
      console.error(err)
      message.error('Save failed')
    } finally {
      setLoading(false)
    }
  }

  const getYearName = (id) => {
    const y = years.find(x => x.id === id)
    return y ? y.name || y.year_name || id : id
  }

  const columns = [
    { title: 'Financial Year', dataIndex: 'year', key: 'year', render: v => getYearName(v) },
    { title: 'Total Budget', dataIndex: 'total_budget', key: 'total_budget' },
    { title: 'Total Income', dataIndex: 'total_income', key: 'total_income' },
    { title: 'Total Expense', dataIndex: 'total_expense', key: 'total_expense' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<EyeOutlined />} size="small" onClick={()=>handleView(r)}>View</Button>
        <Button icon={<EditOutlined />} size="small" onClick={()=>openEdit(r)}>Edit</Button>
        <Button danger icon={<DeleteOutlined />} size="small" onClick={()=>handleDelete(r.id)}>Delete</Button>
      </Space>
    ) }
  ]

  return (
    <div style={{padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, gap:12}}>
        <h3 style={{margin:0}}>Budget Summaries</h3>
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

      <Modal title={editing ? 'Edit Budget Summary' : 'Add budget summary'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="year" label="Financial Year" rules={[{required:true, message:'Select year'}]}>
            <Select showSearch placeholder="Select year" options={years.map(y=>({label:y.name||y.year_name, value:y.id}))} />
          </Form.Item>
          <Form.Item name="total_budget" label="Total Budget">
            <Input />
          </Form.Item>
          <Form.Item name="total_income" label="Total Income">
            <Input />
          </Form.Item>
          <Form.Item name="total_expense" label="Total Expense">
            <Input />
          </Form.Item>
          <Form.Item name="balance" label="Balance">
            <Input />
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

      <Modal title="Budget Summary" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>] }>
        {viewing && (
          <div>
            <p><strong>Year:</strong> {getYearName(viewing.year)}</p>
            <p><strong>Total Budget:</strong> {viewing.total_budget}</p>
            <p><strong>Total Income:</strong> {viewing.total_income}</p>
            <p><strong>Total Expense:</strong> {viewing.total_expense}</p>
            <p><strong>Balance:</strong> {viewing.balance}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BudgetSummary