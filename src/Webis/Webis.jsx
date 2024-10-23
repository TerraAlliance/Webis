import { useWindowSize } from "@uidotdev/usehooks"
import { observer } from "@legendapp/state/react"

import { Flexbox } from "../3dgui/Flexbox"
import { Display } from "./Display"
import { Tree } from "./Tree"
import { Sidebar } from "./Sidebar"
import { app } from "./state"

// export function Webis() {
//   const size = useWindowSize()

//   if (size.height === null) {
//     return null
//   }

//   return (
//     <Flexbox y={0} width={size.width - 40} height={size.height - 40} spacing={20}>
//       <Display grow={4} />
//       <Tree grow={4} />
//       <Flexbox spacing={20} grow={1} direction={"column"}>
//         {sidebars()}
//       </Flexbox>
//     </Flexbox>
//   )
// }
export const Webis = observer(function Component() {
  const size = useWindowSize()

  if (size.height === null) {
    return null
  }

  return (
    <Flexbox y={0} width={size.width - 40} height={size.height - 40} spacing={20}>
      <Display grow={4} />
      <Tree grow={4} />
      <Flexbox spacing={20} grow={1} direction={"column"}>
        {sidebars()}
      </Flexbox>
    </Flexbox>
  )
})

function sidebars() {
  const htmlElements = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a", "button"]
  // const cssProperties = ["display", "width", "height"]

  const style = app.selected.style.get()

  console.log(app.selected.style.get())

  return [<Sidebar key="html" grow={1} buttonTexts={htmlElements} />, <Sidebar key="css" grow={1} buttonTexts={Object.keys(style || [])} hue={0} />]
}
