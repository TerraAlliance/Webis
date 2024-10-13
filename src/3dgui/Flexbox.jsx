import { cloneElement } from "react"

export function Flexbox({ position, width, height, spacing, children }) {
  const totalGrow = children.reduce((sum, child) => sum + (child.props.grow || 0), 0);
  const availableWidth = width - spacing * (children.length + 1);
  const childWidths = children.map((child) => ((child.props.grow || 0) / totalGrow) * availableWidth);

  let currentXPosition = -width / 2 + spacing;

  return (
    <group position={position}>
      {children.map((child, index) => {
        const childWidth = childWidths[index];
        const childPositionX = currentXPosition + childWidth / 2;
        currentXPosition += childWidth + spacing;

        return cloneElement(child, {
          key: index,
          width: childWidth,
          height: height - spacing * 2,
          position: [childPositionX, 0, 0],
        });
      })}
    </group>
  );
}