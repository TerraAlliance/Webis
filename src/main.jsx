import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

import { Gradient } from "./Gradient.js"
const gradient = new Gradient()
gradient.initGradient("#gradient")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
