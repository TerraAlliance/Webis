import { ScrollingWindow } from "../3dgui/ScrollingWindow"
import { ScrollingDiv } from "../3dgui/ScrollingDiv"

const elementArray = ["Division", "Paragraph", "Span", "Line Break", "Anchor", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6"]

export function Sidebar({ position, width, height }) {
  return (
    <group position={position}>
      <ScrollingWindow width={width} height={height}>
        {elementArray.map((element, i) => (
          <ScrollingDiv key={i} height={30} text={element} />
        ))}
      </ScrollingWindow>
    </group>
  )
}
