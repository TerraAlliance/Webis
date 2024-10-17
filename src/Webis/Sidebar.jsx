import { ScrollingWindow } from "../3dgui/ScrollingWindow"
import { ScrollingDiv } from "../3dgui/ScrollingDiv"
import { ScrollingText } from "../3dgui/ScrollingText"

const elementArray = [
  "Division",
  "Paragraph",
  "Span",
  "Line Break",
  "Anchor",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Heading 4",
  "Heading 5",
  "Heading 6",
  "Image",
  "Form",
  "Button",
  "Input",
  "Label",
  "Select",
  "Option",
  "Textarea",
  "Table",
  "Table Row",
  "Table Data",
  "Table Header",
  "List",
  "Ordered List",
  "Unordered List",
  "List Item",
  "Section",
  "Article",
  "Nav",
  "Footer",
  "Header",
  "Aside",
  "Main",
  "Audio",
  "Video",
  "Canvas",
  "Figure",
  "Figcaption",
  "Details",
  "Summary",
]

export function Sidebar({ position, width, height }) {
  return (
    <group position={position}>
      <ScrollingWindow width={width} height={height}>
        {elementArray.map((element, i) => (
          <ScrollingDiv key={i} height={30}>
            <ScrollingText text={element} fontSize={20}  />
          </ScrollingDiv>
        ))}
      </ScrollingWindow>
    </group>
  )
}
