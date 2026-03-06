import { Card, Form, Input } from 'antd'

export function OrgDetails() {
  return (
    <Card title="Реквизиты организации" style={{ marginBottom: 24 }}>
      <Form.Item name="inn" label="ИНН">
        <Input placeholder="10 или 12 цифр" />
      </Form.Item>
      <Form.Item name="kpp" label="КПП">
        <Input placeholder="9 цифр" />
      </Form.Item>
      <Form.Item name="orgName" label="Наименование организации (необязательно)">
        <Input placeholder="ООО «Пример»" />
      </Form.Item>
    </Card>
  )
}
