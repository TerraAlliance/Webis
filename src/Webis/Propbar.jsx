import { Sidebar } from "./Sidebar"
import { app } from "./state"

export function Propbar({ x, y, z, width, height }) {
  const style = app.selected.style.get()
  return <Sidebar x={x} y={y} z={z} width={width} height={height} key="css" buttonTexts={Object.keys(style || [])} hue={0} />
}
