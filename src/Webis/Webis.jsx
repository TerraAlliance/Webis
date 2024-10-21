import { useWindowSize } from "@uidotdev/usehooks"

import { Flexbox } from "../3dgui/Flexbox"
import { Display } from "./Display"
import { Tree } from "./Tree"
import { Sidebar } from "./Sidebar"

export function Webis() {
  const size = useWindowSize()

  if (size.height === null) {
    return null
  }

  return (
    <Flexbox position={[0, 20, 0]} width={size.width} height={size.height - 40} spacing={20}>
      <Display grow={4} />
      <Tree grow={4} />
      <Sidebar grow={1} />
    </Flexbox>
  )
}
