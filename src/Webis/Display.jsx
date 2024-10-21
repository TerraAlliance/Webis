import { createElement } from "react"
import { Html } from "@react-three/drei"
import { Window } from "../3dgui/Window"
import { app } from "./state"

const renderElements = (elements) => {
  return elements.map((element, i) => {
    const { component, props, children } = element
    return createElement(component, { ...props, key: i }, Array.isArray(children) ? renderElements(children) : children)
  })
}

import { useEffect, useRef } from "react"

export function Display({ position, width, height }) {
  const elements = app.elements.get()
  const container = useRef(null)

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [elements])

  return (
    <group position={position}>
      <Window width={width} height={height} />
      <Html
        position={[0, 0, 25.5]}
        distanceFactor={400}
        transform={true}
        occlude={true}
        style={{
          width: width - 40 + "px",
          height: height - 40 + "px",
          backgroundColor: "white",
          userSelect: "none",
          overflowY: "hidden",
          borderRadius: "10px",
        }}
      >
        <div
          ref={container}
          style={{
            width: "100%",
            height: "100%",
            overflowY: "scroll",
          }}
        >
          {renderElements(elements)}
        </div>
      </Html>
    </group>
  )
}
