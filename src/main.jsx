import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { Webis } from "./Webis/Webis"

import { Gradient } from "./Gradient.js"
const gradient = new Gradient()
gradient.initGradient("#gradient")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <Webis />
    </App>
  </StrictMode>
)
