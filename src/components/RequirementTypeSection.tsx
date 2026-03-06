import { Card, Form, Select } from 'antd'

const REQUIREMENT_TYPE_OPTIONS = [
  { value: 'mrot_parttime', label: 'Зарплата ниже МРОТ (неполная ставка)' },
  { value: 'nds_explanation', label: 'Пояснения по расхождениям в декларации НДС' },
] as const

export function RequirementTypeSection() {
  return (
    <Card title="Тип требования" style={{ marginBottom: 24 }}>
      <Form.Item name="requirementType" label={null}>
        <Select
          options={REQUIREMENT_TYPE_OPTIONS}
          listHeight={256}
          style={{ maxWidth: 500 }}
          placeholder="Выберите тип требования"
        />
      </Form.Item>
    </Card>
  )
}
