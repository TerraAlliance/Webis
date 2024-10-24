import { useWindowSize } from "@uidotdev/usehooks"
import { observer } from "@legendapp/state/react"

import { Flexbox } from "../3dgui/Flexbox"
import { Display } from "./Display"
import { Tree } from "./Tree"

import { Createbar } from "./Createbar"
import { Propbar } from "./Propbar"

export const Webis = observer(function Component() {
  const size = useWindowSize()

  if (size.height === null) {
    return null
  }

  return (
    <Flexbox y={0} width={size.width - 40} height={size.height - 40} spacing={20} direction={size.height > size.width ? "column" : "row"}>
      <Display grow={4} />
      <Tree grow={4} />
      <Flexbox spacing={20} grow={1} direction={size.height > size.width ? "row" : "column"}>
        <Createbar grow={1} />
        <Propbar grow={1} />
      </Flexbox>
    </Flexbox>
  )
})
