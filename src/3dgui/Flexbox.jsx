import { cloneElement } from "react"

export function Flexbox({ position, width, height, spacing, children }) {
  const total_grow = children.reduce((sum, child) => sum + (child.props.grow || 0), 0)
  const available_width = width - spacing * (children.length + 1)
  const child_widths = children.map((child) => ((child.props.grow || 0) / total_grow) * available_width)

  let current_position = -width / 2 + spacing

  return (
    <group position={position}>
      {children.map((child, i) => {
        const child_width = child_widths[i]

        const child_position = current_position + child_width / 2
        current_position += child_width + spacing

        return cloneElement(child, {
          key: i,
          width: child_width,
          height: height - spacing * 2,
          position: [child_position, 0, 0],
        })
      })}
    </group>
  )
}
