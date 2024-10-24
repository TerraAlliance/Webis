import { useState, useEffect } from "react"
import { FlowText } from "./FlowText"

export function FlowInput({ text, selected, ...props }) {
  const [inputText, setInputText] = useState([])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selected) {
        if (e.key === "Backspace") {
          setInputText((prev) => prev.slice(0, -1))
        } else {
          setInputText((prev) => prev + e.key)
        }
      }
    }

    if (selected) {
      window.addEventListener("keypress", handleKeyPress)
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [selected])

  return (
    <>
      <FlowText text={inputText.length > 0 ? inputText : text} {...props} />
    </>
  )
}

FlowInput.displayName = "FlowInput"
