import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
} from 'docx'

export type RequirementType = 'mrot_parttime' | 'nds_explanation'

export type FnsResponseData = {
  requirementType: RequirementType
  inn: string
  kpp: string
  orgName: string
  requirementNumber: string
  requirementDate: string
  employees: { fio: string; snils: string }[]
  mrot: string
  ndsPeriod?: string
  ndsDiscrepancySummary?: string
  ndsExplanationText?: string
}

const MROT_ATTACHMENTS_TEXT =
  '— приказы о неполном рабочем времени (или выписки из них);\n— табели учёта рабочего времени;\n— расчёт заработной платы в пересчёте на полную ставку (в размере не ниже МРОТ).'

const NDS_ATTACHMENTS_TEXT =
  '— выписки по операциям;\n— первичные документы по сделкам;\n— расчёты и расшифровки по декларации НДС.'

export function buildFnsResponseDocument(data: FnsResponseData): Document {
  const {
    requirementType,
    inn,
    kpp,
    orgName,
    requirementNumber,
    requirementDate,
    employees,
    mrot,
    ndsPeriod = '',
    ndsDiscrepancySummary = '',
    ndsExplanationText = '',
  } = data

  const companyLine = [inn && `ИНН ${inn}`, kpp && `КПП ${kpp}`, orgName].filter(Boolean).join(', ')

  const header: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: 'Исх. № _____________', size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `Дата: ${new Date().toLocaleDateString('ru-RU')}`, size: 22 })],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'В ИФНС России', size: 22 })],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [
        new TextRun({
          text: companyLine || '(укажите ИНН, КПП, наименование)',
          size: 22,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [
        new TextRun({
          text: `На № ${requirementNumber || '__________'} от ${requirementDate || '__________'}`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Пояснения', bold: true, size: 22 })],
    }),
    new Paragraph({ text: '' }),
  ]

  const footer: Paragraph[] = [
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Рекомендуемые приложения к ответу:', bold: true, size: 22 })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: requirementType === 'mrot_parttime' ? MROT_ATTACHMENTS_TEXT : NDS_ATTACHMENTS_TEXT,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: '_________________________ / _________________________', size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '(подпись)', italics: true, size: 20 })],
    }),
  ]

  let body: Paragraph[] | (Paragraph | Table)[] = []

  if (requirementType === 'mrot_parttime') {
    const employeeRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '№', bold: true })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'ФИО', bold: true })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '№ СНИЛС', bold: true })] })],
          }),
        ],
      }),
      ...employees
        .filter((e) => e.fio.trim() || e.snils.trim())
        .map(
          (e, i) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(String(i + 1))] }),
                new TableCell({ children: [new Paragraph(e.fio || '—')] }),
                new TableCell({ children: [new Paragraph(e.snils || '—')] }),
              ],
            })
        ),
    ]
    body = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'В ответ на требование поясняем следующее. При выполнении своих трудовых функций в полном объёме заработная плата соответствует размеру МРОТ. В организации имеются сотрудники, работающие на неполное рабочее время (0,5 ставки). Месячная заработная плата указанных работников ниже минимального размера оплаты труда (МРОТ) в связи с пропорциональной оплатой труда при неполном рабочем времени (часть 3 статьи 133 Трудового кодекса Российской Федерации). В пересчёте на полную норму рабочего времени заработная плата данных работников соответствует или превышает МРОТ, установленный в Российской Федерации.',
            size: 22,
          }),
        ],
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [new TextRun({ text: 'Список сотрудников, работающих на неполную ставку:', bold: true, size: 22 })],
      }),
      new Paragraph({ text: '' }),
      new Table({
        width: { size: 100, type: 'pct' },
        rows: employeeRows.length ? employeeRows : [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('—')] }),
              new TableCell({ children: [new Paragraph('—')] }),
              new TableCell({ children: [new Paragraph('—')] }),
            ],
          }),
        ],
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [
          new TextRun({
            text: `МРОТ на дату ответа: ${mrot} ₽ (федеральный МРОТ с 01.01.2026, ФЗ № 429-ФЗ).`,
            size: 22,
          }),
        ],
      }),
    ]
  } else {
    const ndsParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: `По требованию представляем пояснения по декларации по НДС за ${ndsPeriod || '__________'}.`,
            size: 22,
          }),
        ],
      }),
      new Paragraph({ text: '' }),
    ]
    if (ndsDiscrepancySummary?.trim()) {
      ndsParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Суть расхождений (запрос инспекции): ${ndsDiscrepancySummary.trim()}.`,
              size: 22,
            }),
          ],
        }),
        new Paragraph({ text: '' })
      )
    }
    ndsParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: ndsExplanationText?.trim() || '(текст пояснений)',
            size: 22,
          }),
        ],
      })
    )
    body = ndsParagraphs
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [...header, ...body, ...footer],
      },
    ],
  })

  return doc
}

export async function downloadFnsResponseDocx(data: FnsResponseData, filename?: string): Promise<string> {
  const doc = buildFnsResponseDocument(data)
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const baseName = `Ответ_ФНС_${data.requirementNumber || 'требование'}_${new Date().toISOString().slice(0, 10)}`
  const suffix = data.requirementType === 'nds_explanation' ? '_НДС' : ''
  const finalFilename = filename || `${baseName}${suffix}.docx`
  a.download = finalFilename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return finalFilename
}
