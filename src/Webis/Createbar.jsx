import { Sidebar } from "../3dgui/Sidebar"
import { createElement } from "./state"
import { app } from "./state"

export function Createbar({ x, y, z, width, height }) {
  const htmlElements = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a", "button", "img"]
  return <Sidebar x={x} y={y} z={z} width={width} height={height} key="html" buttonTexts={htmlElements} onClick={onClick} />
}

function onClick(e, element) {
  const selected = app.selected.id.get()
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
