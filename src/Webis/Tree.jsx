import { observer } from "@legendapp/state/react"

import { FlowDiv } from "../3dgui/FlowDiv"
import { FlowWindow } from "../3dgui/FlowWindow"
import { FlowTag } from "../3dgui/FlowTag"
import { FlowInput } from "../3dgui/FlowInput"
import { app } from "./state"

export const Tree = observer(function Component({ x, y, z, width, height }) {
  const elements = app.elements.get()

  const spacing = 5
  const itemHeight = 30

  const renderComponents = (tree, parentY = 0) => {
    let acc = 0

    return tree.map((element) => {
      const { component, props, children, id } = element

      const y = acc - (itemHeight + spacing) / 2
      acc -= itemHeight + spacing

      const maxDepth = Array.isArray(children) ? countDepth(children) : 0
      const totalChildren = Array.isArray(children) ? countChildren(children) - maxDepth : 0

      return (
        <FlowDiv
          key={id}
          y={parentY || y}
          height={totalChildren > 0 ? totalChildren * itemHeight + (totalChildren - 1) * spacing + (maxDepth + 1) * itemHeight * 2 : itemHeight}
          spacing={spacing}
          selected={app.selected.id.get() === id}
          onClick={(e) => {
            e.stopPropagation()
            app.selected.id.set(id)
            app.selected.style.set(props.style)
          }}
        >
          {["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"].includes(component) && <FlowInput text={children} selected={app.selected.id.get() === id} />}
          <FlowTag tag={component} />
          {Array.isArray(children) ? renderComponents(children, y) : null}
        </FlowDiv>
      )
    })
  }

  return (
    <group position={[x, y, z]}>
      <FlowWindow width={width} height={height} onClick={(e) => (e.stopPropagation(), app.selected.set(undefined))}>
        {elements && renderComponents(elements)}
      </FlowWindow>
    </group>
  )
})

const countChildren = (children) => children.reduce((count, child) => count + 1 + (Array.isArray(child.children) ? countChildren(child.children) : 0), 0)

const countDepth = (children) => {
  return children.reduce((totalDepth, child) => {
    if (Array.isArray(child.children) && child.children.length > 0) {
      return totalDepth + 1 + countDepth(child.children)
    }
    return totalDepth
  }, 0)
}
