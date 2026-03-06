import { useState } from 'react'
import { Alert, Form, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import {
  RequirementTypeSection,
  OrgDetails,
  RequirementSection,
  EmployeesSection,
  NdsSection,
  ActionsSection,
} from './components'

type EmployeeFormItem = { fio: string; snils: string }

const defaultEmployee = (): EmployeeFormItem => ({ fio: '', snils: '' })

export default function App() {
  const [form] = Form.useForm()
  const requirementType = Form.useWatch('requirementType', form) ?? 'mrot_parttime'
  const [mrot, setMrot] = useState<string>('27 093')
  const [mrotSource, setMrotSource] = useState<string>('Федеральный МРОТ на 2026 г.')
  const [downloadInfo, setDownloadInfo] = useState<{ filename: string } | null>(null)

  const onUpdateData = () => {
    setMrot('27 093')
    setMrotSource('Федеральный МРОТ с 01.01.2026 (ФЗ № 429-ФЗ)')
  }

  const onDownloadWord = async () => {
    try {
      const type = form.getFieldValue('requirementType') ?? 'mrot_parttime'
      const fieldsToValidate =
        type === 'mrot_parttime'
          ? ['requirementType', 'inn', 'kpp', 'orgName', 'requirementNumber', 'requirementDate', 'employees']
          : ['requirementType', 'inn', 'kpp', 'orgName', 'requirementNumber', 'requirementDate', 'ndsRate', 'ndsPeriod', 'ndsExplanationText']
      await form.validateFields(fieldsToValidate)
      const allValues = form.getFieldsValue()
      const requirementDate =
        allValues.requirementDate && dayjs.isDayjs(allValues.requirementDate)
          ? (allValues.requirementDate as Dayjs).format('YYYY-MM-DD')
          : String(allValues.requirementDate ?? '')
      const { downloadFnsResponseDocx } = await import('./generateFnsResponseDoc')
      const filename = await downloadFnsResponseDocx({
        requirementType: type,
        inn: allValues.inn ?? '',
        kpp: allValues.kpp ?? '',
        orgName: allValues.orgName ?? '',
        requirementNumber: allValues.requirementNumber ?? '',
        requirementDate,
        employees: (allValues.employees ?? []).map((e: EmployeeFormItem) => ({
          fio: e.fio ?? '',
          snils: e.snils ?? '',
        })),
        mrot,
        ndsRate: allValues.ndsRate ?? '',
        ndsPeriod: allValues.ndsPeriod ?? '',
        ndsDiscrepancySummary: allValues.ndsDiscrepancySummary ?? '',
        ndsExplanationText: allValues.ndsExplanationText ?? '',
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
          ndsRate: undefined,
          ndsPeriod: '',
          ndsDiscrepancySummary: '',
          ndsExplanationText: '',
        }}
      >
        <RequirementTypeSection />
        <OrgDetails />
        <RequirementSection />
        {requirementType === 'mrot_parttime' && <EmployeesSection />}
        {requirementType === 'nds_explanation' && <NdsSection />}
        <ActionsSection
          showMrot={requirementType === 'mrot_parttime'}
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
