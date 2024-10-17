import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

import { Gradient } from "./Gradient.js"

// Create your instance
const gradient = new Gradient()

// Call `initGradient` with the selector to your canvas
gradient.initGradient("#gradient-canvas")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
