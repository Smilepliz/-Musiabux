import { Button, Card, Form, Input, Space, Typography } from 'antd'

type EmployeeFormItem = { fio: string; snils: string }

const defaultEmployee = (): EmployeeFormItem => ({ fio: '', snils: '' })

export function EmployeesSection() {
  return (
    <Card
      title="Сотрудники на неполной ставке (ФИО и СНИЛС)"
      style={{ marginBottom: 24 }}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Эти данные попадут в текст ответа поименно. Добавьте всех сотрудников, по
        которым запросили пояснения.
      </Typography.Paragraph>
      <Form.List name="employees">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 12 }}
                align="end"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'fio']}
                  label="ФИО"
                  style={{ marginBottom: 0, minWidth: 200 }}
                >
                  <Input placeholder="Иванов Иван Иванович" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'snils']}
                  label="№ СНИЛС"
                  style={{ marginBottom: 0, minWidth: 180 }}
                >
                  <Input placeholder="123-456-789 00" />
                </Form.Item>
                <Button
                  htmlType="button"
                  onClick={() => remove(name)}
                  disabled={fields.length <= 1}
                >
                  Удалить
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add(defaultEmployee())} block>
                + Добавить сотрудника
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
  )
}
