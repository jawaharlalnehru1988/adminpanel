import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import FinancialYearService from './services/FinancialYearService'
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
      // const res = await BudgetSummaryService.getBudgetSummaries()
      // setList(res.data || [])
      setList([])
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
      yearId: record.yearId,
      totalBudget: record.totalBudget,
      totalIncome: record.totalIncome,
      totalExpense: record.totalExpense,
      balance: record.balance,
      clientId: record.clientId,
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
          // await BudgetSummaryService.deleteBudgetSummary(id)
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
      yearId: values.yearId,
      totalBudget: values.totalBudget || null,
      totalIncome: values.totalIncome || null,
      totalExpense: values.totalExpense || null,
      balance: values.balance || null,
      clientId: values.clientId || null,
      language: values.language || null,
    }

    setLoading(true)
    try {
      console.log('BudgetSummary payload (not sent):', payload)
      if (editing) {
        // TODO: replace with real API call
        // await BudgetSummaryService.updateBudgetSummary(editing.id, payload)
        message.success('Updated')
      } else {
        // TODO: replace with real API call
        // await BudgetSummaryService.createBudgetSummary(payload)
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
    return y ? y.name || y.year || id : id
  }

  const columns = [
    { title: 'Financial Year', dataIndex: 'yearId', key: 'yearId', render: v => getYearName(v) },
    { title: 'Total budget', dataIndex: 'totalBudget', key: 'totalBudget' },
    { title: 'Total income', dataIndex: 'totalIncome', key: 'totalIncome' },
    { title: 'Total expense', dataIndex: 'totalExpense', key: 'totalExpense' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    { title: 'ClientId', dataIndex: 'clientId', key: 'clientId' },
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
          <Form.Item name="yearId" label="Financial Year" rules={[{required:true, message:'Select year'}]}>
            <Select showSearch placeholder="Select year" options={years.map(y=>({label:y.name||y.year, value:y.id}))} />
          </Form.Item>
          <Form.Item name="totalBudget" label="Total budget">
            <Input />
          </Form.Item>
          <Form.Item name="totalIncome" label="Total income">
            <Input />
          </Form.Item>
          <Form.Item name="totalExpense" label="Total expense">
            <Input />
          </Form.Item>
          <Form.Item name="balance" label="Balance">
            <Input />
          </Form.Item>
          <Form.Item name="clientId" label="ClientId">
            <Input />
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

      <Modal title="Budget Summary" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>] }>
        {viewing && (
          <div>
            <p><strong>Year:</strong> {getYearName(viewing.yearId)}</p>
            <p><strong>Total budget:</strong> {viewing.totalBudget}</p>
            <p><strong>Total income:</strong> {viewing.totalIncome}</p>
            <p><strong>Total expense:</strong> {viewing.totalExpense}</p>
            <p><strong>Balance:</strong> {viewing.balance}</p>
            <p><strong>ClientId:</strong> {viewing.clientId}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BudgetSummary