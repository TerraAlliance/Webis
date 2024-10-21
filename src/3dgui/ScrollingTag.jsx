import { ScrollingText } from "../3dgui/ScrollingText"

export function ScrollingTag({ tag, singleLine = true, ...props }) {
  return (
    <>
      <ScrollingText text={"<" + tag + ">"} location={singleLine ? "left" : "topLeft"} anchorX={"left"} {...props} />
      <ScrollingText text={"<" + tag + "/>"} location={singleLine ? "right" : "bottomLeft"} anchorX={singleLine ? "right" : "left"} {...props} />
    </>
  )
}
