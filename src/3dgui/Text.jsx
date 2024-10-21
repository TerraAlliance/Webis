import * as React from "react"
import { Text as TextMeshImpl, preloadFont } from "troika-three-text"
import { useThree } from "@react-three/fiber"
import { suspend } from "suspend-react"

export const Text = /* @__PURE__ */ React.forwardRef(
  ({ sdfGlyphSize = 64, anchorX = "center", anchorY = "middle", font, fontSize = 1, children, characters, yPos, onSync, ...props }, ref) => {
    const invalidate = useThree(({ invalidate }) => invalidate)
    // const [troikaMesh] = React.useState(() => new TextMeshImpl())

    const troikaMesh = React.useRef(new TextMeshImpl())

    React.useEffect(() => {
      if (troikaMesh.current) {
        troikaMesh.current.dispose()
      }
      troikaMesh.current = new TextMeshImpl()
    }, [yPos, anchorX, anchorY])

    const [nodes, text] = React.useMemo(() => {
      const n = []
      let t = ""
      React.Children.forEach(children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
          t += child
        } else {
          n.push(child)
        }
      })
      return [n, t]
    }, [children])

    suspend(() => new Promise((res) => preloadFont({ font, characters }, res)), ["troika-text", font, characters])

    React.useLayoutEffect(
      () =>
        void troikaMesh.current.sync(() => {
          invalidate()
          if (onSync) onSync(troikaMesh.current)
        })
    )

    React.useEffect(() => {
      return () => troikaMesh.current.dispose()
    }, [troikaMesh.current])

    return (
      <primitive
        object={troikaMesh.current}
        ref={ref}
        font={font}
        text={text}
        anchorX={anchorX}
        anchorY={anchorY}
        fontSize={fontSize}
        sdfGlyphSize={sdfGlyphSize}
        {...props}
      >
        {nodes}
      </primitive>
    )
  }
)

Text.displayName = "Text"
