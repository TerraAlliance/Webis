import { useRef } from "react"

import { ScrollWindow } from "../3dgui/ScrollWindow"
import { ScrollDiv } from "../3dgui/ScrollDiv"
import { ScrollText } from "../3dgui/ScrollText"
import { createElement } from "./state"

import { app } from "./state"

export function Sidebar({ x, y, z, width, height, buttonTexts, hue, ...props }) {
  return (
    <group position={[x, y, z]}>
      <ScrollWindow width={width} height={height} childHeight={30}>
        {buttonTexts.map((element, i) => (
          <Button element={element} hue={hue} key={i} props={props} />
        ))}
      </ScrollWindow>
    </group>
  )
}

function Button({ element, hue, ...props }) {
  const selected = app.selected.id.get()
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  const onClick = (e) => {
    e.stopPropagation()
    switch (element) {
      case "div":
        createElement(
          element,
          {
            style: {
              backgroundColor: getRandomColor(),
              height: "auto",
              minHeight: "100px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1%",
            },
          },
          [],
          selected || []
        )
        break
      case "p":
        createElement(element, { style: { color: "black" } }, "This is a paragraph.", selected || [])
        break
      case "span":
        createElement(element, { style: { color: "black" } }, "span", selected || [])
        break
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        createElement(element, { style: { color: "black" } }, "This is a Title", selected || [])
        break
      case "a":
        createElement(element, { href: "#" }, "This is a hyperlink!", selected || [])
        break
      case "button":
        createElement(element, { style: { color: "black" } }, "Click me!", selected || [])
        break
      case "img":
        createElement(element, { src: "./cat" + getRandom() + ".webp" }, null, selected || [])
        break
    }
  }

  return (
    <ScrollDiv
      {...props}
      hue={hue}
      onPointerDown={(e) => {
        e.stopPropagation()
        onClick(e)
        timeoutRef.current = setTimeout(() => (intervalRef.current = setInterval(() => onClick(e), 100)), 100)
      }}
      onPointerUp={() => (clearTimeout(timeoutRef.current), clearInterval(intervalRef.current))}
      onPointerLeave={() => (clearTimeout(timeoutRef.current), clearInterval(intervalRef.current))}
    >
      <ScrollText text={element} fontSize={20} />
    </ScrollDiv>
  )
}

const getRandom = (() => {
  let nums = []
  return () => (nums.length === 0 && (nums = [...Array(12).keys()].map((n) => n + 1)), nums.splice(Math.floor(Math.random() * nums.length), 1)[0])
})()

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}
