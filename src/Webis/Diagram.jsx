// import { cloneElement } from "react"
// import { Switch } from "@legendapp/state/react"
// import { Text } from "@react-three/drei"

import { Window } from "../3dgui/Window"
import { ScrollingDiv } from "../3dgui/ScrollingDiv"
import { app } from "./state"

export function Diagram({ position, width, height }) {
  return (
    <group position={position}>
      <Window width={width} height={height} />
      {/* <Elements width={width} height={height} /> */}
      <ScrollingDiv time={-0.2} width={700} height={70} />
      <ScrollingDiv time={-0.5} width={700} height={70} />
      <ScrollingDiv time={-1} width={700} height={70} />
      <ScrollingDiv time={-1.5} width={700} height={70} />
      <ScrollingDiv time={-2} width={700} height={70} />
      <ScrollingDiv time={-2.5} width={700} height={70} />
      <ScrollingDiv time={-3} width={700} height={70} />
      <ScrollingDiv time={-3.5} width={700} height={70} />
      {/* <ScrollingDiv time={-4} width={700} height={70} />
      <ScrollingDiv time={-4.5} width={700} height={70} />
      <ScrollingDiv time={-5} width={700} height={70} />
      <ScrollingDiv time={-5.5} width={700} height={70} />
      <ScrollingDiv time={-6} width={700} height={70} />
      <ScrollingDiv time={-6.5} width={700} height={70} />
      <ScrollingDiv time={-7} width={700} height={70} />
      <ScrollingDiv time={-7.5} width={700} height={70} />
      <ScrollingDiv time={-8} width={700} height={70} />
      <ScrollingDiv time={-8.5} width={700} height={70} />
      <ScrollingDiv time={-9} width={700} height={70} />
      <ScrollingDiv time={-9.5} width={700} height={70} /> */}
    </group>
  )
}

// function Elements({ width, height }) {
//   console.log(renderElements(app.elements.get(), 0))
//   return (
//     <>
//       <Element type={"Body"} width={width - 20} height={height - 20}>
//         {renderElements(app.elements.get(), 0)}
//       </Element>
//     </>
//   )
// }

// const componentMap = { Element: Element }

// const renderElements = (elements) => {
//   return Object.entries(elements).map(([key, value]) => {
//     const { component: componentName, children, ...props } = value
//     const Component = componentMap[componentName]

//     const childElements = children ? renderElements(children) : null

//     return (
//       <Component key={key} {...props}>
//         {childElements}
//       </Component>
//     )
//   })
// }

// function Element({ position, type, width, height, children, lightness = 90 }) {
//   return (
//     <group position={position}>
//       <group position={[0, 0, 20]}>
//         <StartTag position={[-width / 2 + 45, height / 2 - 15, 11]} type={type} />
//         <Switch value={type}>
//           {{
//             Body: () => <EndTag position={[-width / 2 + 45, -height / 2 + 15, 11]} type={type} />,
//             Span: () => <EndTag position={[width / 2 - 45, height / 2 - 15, 11]} type={type} />,
//             default: () => <EndTag position={[-width / 2 + 45, -height / 2 + 15, 11]} type={type} />,
//           }}
//         </Switch>
//         <Window width={width} height={height} lightness={lightness} selectable={true} />
//       </group>
//       <group position={[0, 0, 20]}>
//         {children &&
//           children.map((child, i) =>
//             cloneElement(child, {
//               key: i,
//               lightness: lightness - 5,
//               width: width - 50,
//               height: height / children.length - 40,
//               position: [0, height / 2 - height / children.length / 2 - (height / children.length) * i, 0],
//             })
//           )}
//       </group>
//     </group>
//   )
// }

// function StartTag({ position, type }) {
//   return <Text position={position} text={`<${type}>`} color={"white"} fontSize={20} />
// }

// function EndTag({ position, type }) {
//   return <Text position={position} text={`</${type}>`} color={"white"} fontSize={20} />
// }
