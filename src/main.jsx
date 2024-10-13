import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

document.addEventListener('contextmenu', event => event.preventDefault())

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
