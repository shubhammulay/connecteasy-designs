
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ConnectEasyUI from "./ConnectEasyUI.jsx"
import ConnectEasyOpsAdminUI from "./ConnectAdminUI.jsx"
// import OpsAdminConsole from "./ConnectAdminV1.jsx"
import OpsAdminConsole from "./ConnectAdminV2.jsx"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConnectEasyUI />
  </React.StrictMode>
)
