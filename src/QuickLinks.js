import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import QuickLinkService from './services/QuickLinkService'
// Note: API calls are left as TODOs per request (no real service call wired)

const QuickLinks = () => {
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
      const res = await QuickLinkService.getQuickLinks()
      setList(res.data || [])
    } catch (err) {
      console.error(err)
      message.error('Failed to load quick links')
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
      label: record.label,
      url: record.url,
      icon: record.icon,
      language: record.language,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete quick link',
      content: 'Are you sure?',
      async onOk() {
        try {
          // TODO: replace with real API call
          await QuickLinkService.deleteQuickLink(id)
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
      label: values.label,
      url: values.url,
      icon: values.icon || null,
      language: values.language || null,
    }

    setLoading(true)
    try {
      // payload prepared for API call
      console.log('QuickLink payload (not sent):', payload)
      if (editing) {
        // TODO: replace with real API call
        await QuickLinkService.updateQuickLink(editing.id, payload)
        message.success('Updated')
      } else {
        // TODO: replace with real API call
        await QuickLinkService.createQuickLink(payload)
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
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { title: 'Url', dataIndex: 'url', key: 'url', render: (t) => <div style={{maxWidth:300, whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={t}>{t}</div> },
    { title: 'Icon', dataIndex: 'icon', key: 'icon' },
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
        <h3 style={{margin:0}}>Quick Links</h3>
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

      <Modal title={editing ? 'Edit Quick Link' : 'Create Quick Link'} open={isModalOpen} onCancel={()=>{setIsModalOpen(false); form.resetFields();}} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="label" label="Label" rules={[{required:true, message:'Enter label'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="Url" rules={[{required:true, message:'Enter url'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="Icon">
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

      <Modal title="Quick Link" open={isViewOpen} onCancel={()=>setIsViewOpen(false)} footer={[<Button key="close" onClick={()=>setIsViewOpen(false)}>Close</Button>] }>
        {viewing && (
          <div>
            <p><strong>Label:</strong> {viewing.label}</p>
            <p><strong>Url:</strong> {viewing.url}</p>
            <p><strong>Icon:</strong> {viewing.icon}</p>
            <p><strong>Language:</strong> {viewing.language}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default QuickLinks