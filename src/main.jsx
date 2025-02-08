import React from "react"
import ReactDOM from "react-dom/client"
import { ConfigProvider } from 'antd'
import { customTheme } from './theme'
import App from "./App"
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)