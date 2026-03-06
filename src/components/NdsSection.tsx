import { Card, Form, Input, Typography } from 'antd'

export function NdsSection() {
  return (
    <Card
      title="Пояснения по НДС"
      style={{ marginBottom: 24 }}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Укажите период, суть расхождений и текст пояснений для ответа в ФНС.
      </Typography.Paragraph>
      <Form.Item
        name="ndsPeriod"
        label="Налоговый период"
        rules={[{ required: true, message: 'Укажите период (например, 1 квартал 2025)' }]}
      >
        <Input placeholder="1 квартал 2025" />
      </Form.Item>
      <Form.Item
        name="ndsDiscrepancySummary"
        label="Суть расхождений (кратко)"
      >
        <Input.TextArea
          rows={2}
          placeholder="Что именно запросила инспекция или в чём усмотрено расхождение"
        />
      </Form.Item>
      <Form.Item
        name="ndsExplanationText"
        label="Текст пояснений"
        rules={[{ required: true, message: 'Введите текст пояснений' }]}
      >
        <Input.TextArea
          rows={6}
          placeholder="Основной текст ответа по расхождениям в декларации по НДС"
        />
      </Form.Item>
    </Card>
  )
}
