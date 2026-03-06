import { useState } from 'react'
import { Alert, Form, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import {
  RequirementTypeSection,
  OrgDetails,
  RequirementSection,
  EmployeesSection,
  ActionsSection,
} from './components'

type EmployeeFormItem = { fio: string; snils: string }

const defaultEmployee = (): EmployeeFormItem => ({ fio: '', snils: '' })

export default function App() {
  const [form] = Form.useForm()
  const [mrot, setMrot] = useState<string>('27 093')
  const [mrotSource, setMrotSource] = useState<string>('Федеральный МРОТ на 2026 г.')
  const [downloadInfo, setDownloadInfo] = useState<{ filename: string } | null>(null)

  const onUpdateData = () => {
    setMrot('27 093')
    setMrotSource('Федеральный МРОТ с 01.01.2026 (ФЗ № 429-ФЗ)')
  }

  const onDownloadWord = async () => {
    try {
      const values = await form.validateFields()
      const requirementDate =
        values.requirementDate && dayjs.isDayjs(values.requirementDate)
          ? (values.requirementDate as Dayjs).format('YYYY-MM-DD')
          : String(values.requirementDate ?? '')
      const { downloadFnsResponseDocx } = await import('./generateFnsResponseDoc')
      const filename = await downloadFnsResponseDocx({
        inn: values.inn ?? '',
        kpp: values.kpp ?? '',
        orgName: values.orgName ?? '',
        requirementNumber: values.requirementNumber ?? '',
        requirementDate,
        employees: (values.employees ?? []).map((e: EmployeeFormItem) => ({
          fio: e.fio ?? '',
          snils: e.snils ?? '',
        })),
        mrot,
      })
      setDownloadInfo({ filename })
      setTimeout(() => setDownloadInfo(null), 12000)
    } catch {
      // validation failed
    }
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 8 }}>
        Musiabux
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Подготовка ответов в ФНС по требованиям о зарплате ниже МРОТ
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          requirementType: 'mrot_parttime',
          inn: '',
          kpp: '',
          orgName: '',
          requirementNumber: '',
          requirementDate: undefined,
          employees: [defaultEmployee()],
        }}
      >
        <RequirementTypeSection />
        <OrgDetails />
        <RequirementSection />
        <EmployeesSection />
        <ActionsSection
          mrot={mrot}
          mrotSource={mrotSource}
          downloadInfo={downloadInfo}
          onUpdateData={onUpdateData}
          onDownloadWord={onDownloadWord}
        />
      </Form>

      <Alert
        type="warning"
        showIcon
        title="Юридическая оговорка"
        description="Шаблон носит справочный характер. Ответственность за соответствие законодательству и итоговый текст ответа несёт пользователь."
      />
    </div>
  )
}
