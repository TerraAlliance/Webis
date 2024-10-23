import { cloneElement, Children } from "react"

export function Flexbox({ x = 0, y = 0, z = 0, width, height, spacing, children, direction = "row" }) {
  const totalGrow = children.reduce((sum, child) => sum + (child.props.grow || 0), 0)

  const availableSize = direction === "row" ? width - spacing * (children.length - 1) : height - spacing * (children.length - 1)
  const childSizes = children.map((child) => ((child.props.grow || 0) / totalGrow) * availableSize)

  let acc = direction === "row" ? -width / 2 : height / 2

  return (
    <group position={[x, y, z]}>
      {Children.map(children, (child, i) => {
        const childSize = childSizes[i]
        const positionOffset = direction === "row" ? acc + childSize / 2 : acc - childSize / 2
        direction === "row" ? (acc += childSize + spacing) : (acc -= childSize + spacing)

        const childProps =
          direction === "row"
            ? { x: positionOffset, y: 0, z: 0, width: childSize, height: height }
            : { x: 0, y: positionOffset, z: 0, width: width, height: childSize }

        return cloneElement(child, {
          ...childProps,
          key: i,
        })
      })}
    </group>
  )
}
