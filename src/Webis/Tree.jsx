import { useMemo } from "react"
import { observer } from "@legendapp/state/react"

import { ScrollingDiv } from "../3dgui/ScrollingDiv"
import { ScrollingWindow } from "../3dgui/ScrollingWindow"
import { ScrollingTag } from "../3dgui/ScrollingTag"
import { app } from "./state"

export const Tree = observer(function Component({ position, width, height }) {
  const elements = app.elements.get()

  const components = elements && renderComponents(elements)

  return (
    <group position={position}>
      <ScrollingWindow width={width} height={height}>
        {components}
      </ScrollingWindow>
    </group>
  )
})

const spacing = 5
const height = 30

const renderComponents = (tree, parentY) => {
  let acc = 0

  return tree.map((element, i) => {
    const { component, id, children } = element

    const y = acc - (height + spacing) / 2
    acc -= height + spacing

    const totalChildren = Array.isArray(children) ? countChildren(children) : 0
    const maxDepth = Array.isArray(children) ? countMaxDepth(children) : 0
    const childHeight = totalChildren > 0 ? totalChildren * (height + spacing) + maxDepth * height * 2 : height

    const components = Array.isArray(children) ? renderComponents(children, y) : []

    return (
      <ScrollingDiv
        key={id}
        y={parentY ? parentY : y}
        height={childHeight}
        spacing={spacing}
        selected={app.selected.get() === id}
        onClick={(e) => (e.stopPropagation(), app.selected.set(id))}
      >
        <ScrollingTag tag={component} />
        {...components}
      </ScrollingDiv>
    )
  })
}

const countChildren = (children) => children.reduce((count, child) => count + 1 + (Array.isArray(child.children) ? countChildren(child.children) : 0), 0)

const countMaxDepth = (children, depth = 1) =>
  children.reduce(
    (maxDepth, child) => (Array.isArray(child.children) && child.children.length > 0 ? Math.max(maxDepth, countMaxDepth(child.children, depth + 1)) : maxDepth),
    depth
  )
