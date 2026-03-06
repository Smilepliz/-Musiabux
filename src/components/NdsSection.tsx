import { Card, Form, Input, Select, Typography } from 'antd'

const NDS_RATE_OPTIONS = [
  { value: '20', label: '20%' },
  { value: '10', label: '10%' },
  { value: '0', label: '0%' },
]

export function NdsSection() {
  return (
    <Card
      title="Пояснения по НДС"
      style={{ marginBottom: 24 }}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Укажите ставку, период, суть расхождений и текст пояснений для ответа в ФНС.
      </Typography.Paragraph>
      <Form.Item
        name="ndsRate"
        label="Ставка НДС"
        rules={[{ required: true, message: 'Выберите ставку НДС' }]}
      >
        <Select
          placeholder="Выберите ставку"
          options={NDS_RATE_OPTIONS}
          style={{ width: 120 }}
          allowClear
        />
      </Form.Item>
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
