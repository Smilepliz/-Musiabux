import { Card, Form, Select } from 'antd'

export function RequirementTypeSection() {
  return (
    <Card title="Тип требования" style={{ marginBottom: 24 }}>
      <Form.Item name="requirementType" label={null}>
        <Select
          options={[
            {
              value: 'mrot_parttime',
              label: 'Зарплата ниже МРОТ (неполная ставка)',
            },
            {
              value: 'nds_explanation',
              label: 'Пояснения по расхождениям в декларации НДС',
            },
          ]}
          style={{ maxWidth: 400 }}
        />
      </Form.Item>
    </Card>
  )
}
