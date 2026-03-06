import { Alert, Button, Card, Space, Typography } from 'antd'

type ActionsSectionProps = {
  mrot: string
  mrotSource: string
  downloadInfo: { filename: string } | null
  onUpdateData: () => void
  onDownloadWord: () => void
}

export function ActionsSection({
  mrot,
  mrotSource,
  downloadInfo,
  onUpdateData,
  onDownloadWord,
}: ActionsSectionProps) {
  return (
    <Card title="Актуальные данные" style={{ marginBottom: 24 }}>
      <Typography.Paragraph style={{ marginBottom: 4 }}>
        МРОТ (для справки в ответе): <strong>{mrot} ₽</strong>
      </Typography.Paragraph>
      <Typography.Paragraph
        type="secondary"
        style={{ marginBottom: 16, fontSize: 12 }}
      >
        {mrotSource}
      </Typography.Paragraph>
      <Space wrap>
        <Button onClick={onUpdateData}>Обновить актуальные данные</Button>
        <Button type="primary" onClick={onDownloadWord}>
          Скачать ответ (Word)
        </Button>
      </Space>
      {downloadInfo && (
        <Alert
          type="success"
          showIcon
          style={{ marginTop: 16 }}
          title="Файл сохранён."
          description={
            <>
              Обычно он попадает в папку <strong>«Загрузки»</strong> (Downloads).
              <br />
              <code style={{ fontSize: 13 }}>{downloadInfo.filename}</code>
            </>
          }
        />
      )}
    </Card>
  )
}
