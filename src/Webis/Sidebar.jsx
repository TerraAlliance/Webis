import { ScrollingWindow } from "../3dgui/ScrollingWindow"
import { ScrollingDiv } from "../3dgui/ScrollingDiv"
import { ScrollingText } from "../3dgui/ScrollingText"
import { createElement } from "./state"

import { app } from "./state"

const elementArray = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a", "button"]

export function Sidebar({ position, width, height }) {
  const selected = app.selected.get()
  return (
    <group position={position}>
      <ScrollingWindow width={width} height={height}>
        {elementArray.map((element, i) => (
          <ScrollingDiv
            key={i}
            height={30}
            onClick={(e) => {
              e.stopPropagation()
              switch (element) {
                case "div":
                  createElement(
                    element,
                    {
                      style: {
                        backgroundColor: getRandomColor(),
                        height: "100px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    },
                    [],
                    selected || []
                  )
                  break
                case "p":
                  createElement(element, null, "This is a paragraph.", selected || [])
                  break
                case "span":
                  createElement(element, null, "span", selected || [])
                  break
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  createElement(element, null, "This is a Title", selected || [])
                  break
                case "a":
                  createElement(element, { href: "#" }, "This is a hyperlink!", selected || [])
                  break
                case "button":
                  createElement(element, { style: { color: "black" } }, "Click me!", selected || [])
                  break
              }
            }}
          >
            <ScrollingText text={element} fontSize={20} />
          </ScrollingDiv>
        ))}
      </ScrollingWindow>
    </group>
  )
}

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  )
}
