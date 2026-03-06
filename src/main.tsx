import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { StyleProvider, createCache } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import App from './App'

function Root() {
  const cache = useMemo(() => createCache(), [])
  return (
    <StyleProvider cache={cache} hashPriority="high">
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </StyleProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
