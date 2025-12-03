import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
// Note: API calls left as TODOs per request. A stub service exists at `src/services/FooterCategoryService.js` if you want to wire it.

const FooterCategories = () => {
  const [list, setList] = useState([])
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
      // const res = await FooterCategoryService.getFooterCategories()
      // setList(res.data || [])
      setList([])
    } catch (err) {
      console.error(err)
      message.error('Failed to load footer categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch(); }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      name: record.name,
      language: record.language,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete footer category',
      content: 'Are you sure?',
      async onOk() {
        try {
          // TODO: replace with real API call
          // await FooterCategoryService.deleteFooterCategory(id)
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
      name: values.name,
      language: values.language || null,
    }

    setLoading(true)
    try {
      console.log('FooterCategory payload (not sent):', payload)
      if (editing) {
        // TODO: replace with real API call
        // await FooterCategoryService.updateFooterCategory(editing.id, payload)
        message.success('Updated')
      } else {
        // TODO: replace with real API call
        // await FooterCategoryService.createFooterCategory(payload)
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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
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
        <h3 style={{margin:0}}>Footer Categories</h3>
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

      <Modal title={editing ? 'Edit Footer Category' : 'Create Footer Category'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{required:true, message:'Enter name'}]}>
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

      <Modal title="Footer Category" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>] }>
        {viewing && (
          <div>
            <p><strong>Name:</strong> {viewing.name}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default FooterCategories