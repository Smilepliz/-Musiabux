import { Card, DatePicker, Form, Input } from 'antd'

export function RequirementSection() {
  return (
    <Card title="Требование ФНС" style={{ marginBottom: 24 }}>
      <Form.Item name="requirementNumber" label="Номер требования">
        <Input placeholder="Например: 1234-5/2024" />
      </Form.Item>
      <Form.Item name="requirementDate" label="Дата требования">
        <DatePicker style={{ width: '100%', maxWidth: 320 }} />
      </Form.Item>
    </Card>
  )
}
