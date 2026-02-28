import { useState } from 'react'

type Employee = { id: string; fio: string; snils: string }

const defaultEmployee = (): Employee => ({
  id: crypto.randomUUID(),
  fio: '',
  snils: '',
})

export default function App() {
  const [requirementType] = useState('mrot_parttime')
  const [inn, setInn] = useState('')
  const [kpp, setKpp] = useState('')
  const [orgName, setOrgName] = useState('')
  const [requirementNumber, setRequirementNumber] = useState('')
  const [requirementDate, setRequirementDate] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([defaultEmployee()])
  // МРОТ с 01.01.2026 по ФЗ № 429-ФЗ (актуализировать при изменении закона)
  const [mrot, setMrot] = useState<string>('27 093')
  const [mrotSource, setMrotSource] = useState<string>('Федеральный МРОТ на 2026 г.')
  const [downloadInfo, setDownloadInfo] = useState<{ filename: string } | null>(null)

  const addEmployee = () => setEmployees((prev) => [...prev, defaultEmployee()])

  const removeEmployee = (id: string) => {
    setEmployees((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev))
  }

  const updateEmployee = (id: string, field: 'fio' | 'snils', value: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  const onUpdateData = () => {
    // Пока подставляем актуальный федеральный МРОТ на 2026 г.; позже — запрос к открытым источникам/бэкенду
    setMrot('27 093')
    setMrotSource('Федеральный МРОТ с 01.01.2026 (ФЗ № 429-ФЗ)')
  }

  const onDownloadWord = async () => {
    const { downloadFnsResponseDocx } = await import('./generateFnsResponseDoc')
    const filename = await downloadFnsResponseDocx({
      inn,
      kpp,
      orgName,
      requirementNumber,
      requirementDate,
      employees: employees.map((e) => ({ fio: e.fio, snils: e.snils })),
      mrot,
    })
    setDownloadInfo({ filename })
    setTimeout(() => setDownloadInfo(null), 12000)
  }

  const sectionStyle = {
    background: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }
  const labelStyle = { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 as const }
  const inputStyle = {
    width: '100%',
    maxWidth: 320,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 12,
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Musiabux</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Подготовка ответов в ФНС по требованиям о зарплате ниже МРОТ
      </p>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 12 }}>Тип требования</h2>
        <select
          value={requirementType}
          onChange={(e) => {}}
          style={{ ...inputStyle, maxWidth: 400 }}
        >
          <option value="mrot_parttime">Зарплата ниже МРОТ (неполная ставка)</option>
        </select>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 16 }}>Реквизиты организации</h2>
        <label style={labelStyle}>ИНН</label>
        <input
          type="text"
          value={inn}
          onChange={(e) => setInn(e.target.value)}
          placeholder="10 или 12 цифр"
          style={inputStyle}
        />
        <label style={labelStyle}>КПП</label>
        <input
          type="text"
          value={kpp}
          onChange={(e) => setKpp(e.target.value)}
          placeholder="9 цифр"
          style={inputStyle}
        />
        <label style={labelStyle}>Наименование организации (необязательно)</label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="ООО «Пример»"
          style={inputStyle}
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 16 }}>Требование ФНС</h2>
        <label style={labelStyle}>Номер требования</label>
        <input
          type="text"
          value={requirementNumber}
          onChange={(e) => setRequirementNumber(e.target.value)}
          placeholder="Например: 1234-5/2024"
          style={inputStyle}
        />
        <label style={labelStyle}>Дата требования</label>
        <input
          type="date"
          value={requirementDate}
          onChange={(e) => setRequirementDate(e.target.value)}
          style={inputStyle}
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 8 }}>Сотрудники на неполной ставке (ФИО и СНИЛС)</h2>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>
          Эти данные попадут в текст ответа поименно. Добавьте всех сотрудников, по которым запросили пояснения.
        </p>
        {employees.map((emp) => (
          <div
            key={emp.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: 12,
              alignItems: 'end',
              marginBottom: 12,
            }}
          >
            <div>
              <label style={{ ...labelStyle, fontSize: 12 }}>ФИО</label>
              <input
                type="text"
                value={emp.fio}
                onChange={(e) => updateEmployee(emp.id, 'fio', e.target.value)}
                placeholder="Иванов Иван Иванович"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 12 }}>№ СНИЛС</label>
              <input
                type="text"
                value={emp.snils}
                onChange={(e) => updateEmployee(emp.id, 'snils', e.target.value)}
                placeholder="123-456-789 00"
                style={inputStyle}
              />
            </div>
            <button
              type="button"
              onClick={() => removeEmployee(emp.id)}
              style={{
                padding: '8px 12px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEmployee}
          style={{
            padding: '8px 16px',
            background: '#e8e8e8',
            border: '1px solid #bbb',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          + Добавить сотрудника
        </button>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: 12 }}>Актуальные данные</h2>
        <p style={{ marginBottom: 4, fontSize: 14 }}>
          МРОТ (для справки в ответе): <strong>{mrot} ₽</strong>
        </p>
        <p style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
          {mrotSource}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onUpdateData}
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Обновить актуальные данные
          </button>
          <button
            type="button"
            onClick={onDownloadWord}
            style={{
              padding: '10px 20px',
              background: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Скачать ответ (Word)
          </button>
        </div>
        {downloadInfo && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <strong>Файл сохранён.</strong> Обычно он попадает в папку <strong>«Загрузки»</strong> (Downloads).
            <br />
            <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{downloadInfo.filename}</span>
          </div>
        )}
      </section>

      <aside
        style={{
          background: '#f9f9e8',
          border: '1px solid #e0e0a0',
          borderRadius: 8,
          padding: 16,
          fontSize: 14,
        }}
      >
        <strong>Юридическая оговорка:</strong> Шаблон носит справочный характер.
        Ответственность за соответствие законодательству и итоговый текст ответа
        несёт пользователь.
      </aside>
    </div>
  )
}
