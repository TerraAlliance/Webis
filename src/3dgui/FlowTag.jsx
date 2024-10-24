import { FlowText } from "./FlowText"

export function FlowTag({ tag, singleLine = true, ...props }) {
  return (
    <>
      <FlowText text={"<" + tag + ">"} location={singleLine ? "left" : "topLeft"} anchorX={"left"} {...props} />
      <FlowText text={"<" + tag + "/>"} location={singleLine ? "right" : "bottomLeft"} anchorX={singleLine ? "right" : "left"} {...props} />
    </>
  )
}

FlowTag.displayName = "FlowTag"
