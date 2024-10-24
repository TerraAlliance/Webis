import { Sidebar } from "./Sidebar"

export function Createbar({ x, y, z, width, height }) {
  const htmlElements = ["div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a", "button", "img"]
  return <Sidebar x={x} y={y} z={z} width={width} height={height} key="html" buttonTexts={htmlElements} />
}
