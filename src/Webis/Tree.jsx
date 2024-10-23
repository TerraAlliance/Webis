import { observer } from "@legendapp/state/react"

import { ScrollDiv } from "../3dgui/ScrollDiv"
import { ScrollWindow } from "../3dgui/ScrollWindow"
import { ScrollTag } from "../3dgui/ScrollTag"
import { app } from "./state"

export const Tree = observer(function Component({ x, y, z, width, height }) {
  const elements = app.elements.get()
  const components = elements && renderComponents(elements)

  return (
    <group position={[x, y, z]}>
      <ScrollWindow width={width} height={height} onClick={(e) => (e.stopPropagation(), app.selected.set(undefined))}>
        {components}
      </ScrollWindow>
    </group>
  )
})

const spacing = 5
const height = 30

const renderComponents = (tree, parentY) => {
  let acc = 0

  return tree.map((element) => {
    const { component, props, children, id } = element

    const y = acc - (height + spacing) / 2
    acc -= height + spacing

    const maxDepth = Array.isArray(children) ? countDepth(children) : 0
    const totalChildren = Array.isArray(children) ? countChildren(children) - maxDepth : 0

    return (
      <ScrollDiv
        key={id}
        y={parentY || y}
        height={totalChildren > 0 ? totalChildren * height + (totalChildren - 1) * spacing + (maxDepth + 1) * height * 2 : height}
        spacing={spacing}
        selected={app.selected.id.get() === id}
        onClick={(e) => (e.stopPropagation(), app.selected.id.set(id), app.selected.style.set(props.style))}
      >
        <ScrollTag tag={component} />
        {Array.isArray(children) ? renderComponents(children, y) : null}
      </ScrollDiv>
    )
  })
}

const countChildren = (children) => children.reduce((count, child) => count + 1 + (Array.isArray(child.children) ? countChildren(child.children) : 0), 0)

const countDepth = (children) => {
  return children.reduce((totalDepth, child) => {
    if (Array.isArray(child.children) && child.children.length > 0) {
      return totalDepth + 1 + countDepth(child.children)
    }
    return totalDepth
  }, 0)
}
