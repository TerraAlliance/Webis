import { useRef } from "react"
import { Html } from "@react-three/drei"
import { observer } from "@legendapp/state/react"

import { Window } from "../3dgui/Window"
import { app } from "./state"

export const Display = observer(function Component({ x, y, z, width, height }) {
  const elements = app.elements.get()
  const container = useRef(null)

  // useEffect(() => {
  //   if (container.current) {
  //     container.current.scrollTop = container.current.scrollHeight
  //   }
  // }, [elements])

  return (
    <group position={[x, y, z]}>
      <Window width={width} height={height} />
      <Html
        position={[0, 0, 15.1]}
        distanceFactor={400}
        transform={true}
        occlude={true}
        style={{
          width: width + "px",
          height: height + "px",
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
            overflowX: "hidden",
            backgroundColor: "white",
          }}
        >
          {renderElements(elements)}
        </div>
      </Html>
    </group>
  )
})

function renderElements(elements) {
  return elements.map((element) => {
    const { component: Component, props, children, id } = element
    const isSelected = app.selected.id.get() === id
    return (
      <Component
        {...props}
        key={id}
        style={{
          ...props?.style,
          backgroundImage: isSelected
            ? "repeating-linear-gradient(-45deg, rgba(255,0,0, 0.5), rgba(255,0,0, 0.5) 5px, transparent 5px,  transparent 10px)"
            : null,
        }}
      >
        {Array.isArray(children) ? renderElements(children) : children}
      </Component>
    )
  })
}
