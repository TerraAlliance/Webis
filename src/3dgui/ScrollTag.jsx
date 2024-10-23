import { ScrollText } from "./ScrollText"

export function ScrollTag({ tag, singleLine = true, ...props }) {
  return (
    <>
      <ScrollText text={"<" + tag + ">"} location={singleLine ? "left" : "topLeft"} anchorX={"left"} {...props} />
      <ScrollText text={"<" + tag + "/>"} location={singleLine ? "right" : "bottomLeft"} anchorX={singleLine ? "right" : "left"} {...props} />
    </>
  )
}

ScrollTag.displayName = "ScrollTag"
