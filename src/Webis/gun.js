import GUN from "gun"
import "https://cdn.jsdelivr.net/npm/gun/lib/open.js"

import { app } from "./state"

localStorage.clear()

const gun = GUN()
const webis = gun.get("webis")
const elements = webis.get("elements")

const nodes = elements.get("nodes")
const order = elements.get("order")

var currentOrder = []
order.once((data) => {
  if (data) currentOrder = JSON.parse(data)
})

const createElement = (component, props, parentId, index) => {
  const id = crypto.randomUUID()
  nodes.get(id).put({ id: id, component: component, props: props, parent: parentId })
  currentOrder.splice(index, 0, id)
  order.put(JSON.stringify(currentOrder))
}

createElement("div", { backgroundColor: "red" }, null, 0)
createElement("div1", { backgroundColor: "red" }, null, 1)
createElement("div2", { backgroundColor: "red" }, null, 2)
createElement("div3", { backgroundColor: "red" }, null, 3)
createElement("div4", { backgroundColor: "red" }, null, 4)
createElement("div5", { backgroundColor: "red" }, null, 5)
createElement("div6", { backgroundColor: "red" }, null, 6)

elements.open((data) => {
  const { order, nodes } = data
  app.elements.set(sortObjectByKeys(JSON.parse(order), nodes))
})

function sortObjectByKeys(keysArray, obj) {
  return keysArray.reduce((sortedObj, key) => {
    if (key in obj) {
      sortedObj[key] = obj[key]
    }
    return sortedObj
  }, {})
}
