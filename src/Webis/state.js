import { observable } from "@legendapp/state"
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking"
enableReactTracking({ auto: true })

import GUN from "gun"
// import "https://cdn.jsdelivr.net/npm/gun/lib/open.js"

export const app = observable({ elements: [] })

const gun = GUN()
const webis = gun.get("webis")

const elements = webis.get("elements")

let elementsArray = []

// elements.once((data) => data && (elementsArray = JSON.parse(data)))
elements.on((data) => app.elements.set(JSON.parse(data)))
app.elements.set([])

export function createElement(component, props, children, parentPath, i) {
  const targetArray = parentPath?.reduce((current, i) => current[i].children, elementsArray) || elementsArray

  const index = i ?? targetArray.length
  const id = [...parentPath, index]

  targetArray.splice(index ?? targetArray.length, 0, { component, id: id, props, children: children })
  elements.put(JSON.stringify(elementsArray))
}
