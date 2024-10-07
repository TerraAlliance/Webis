import { Text } from "@react-three/drei"

import { Window } from "../3dgui/Window"

const elementArray = ["Division", "Paragraph", "Span", "Line Break", "Anchor", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6"]

export function Sidebar({ position, width, height }) {
  return (
    <group position={position} rotation={[0, 0, 0]}>
      <Window width={width} height={height} />
      <Buttons width={width} height={height} />
    </group>
  )
}

function Buttons({ width, height }) {
  return (
    <>
      {elementArray.map((element, index) => (
        <Button
          key={index}
          position={[0, height / 2 - 18 - width * 0.05 - index * 40, 10]}
          width={width - width * 0.05}
          height={36}
          element={element}
          index={index}
        />
      ))}
    </>
  )
}

function Button({ position, width, height, element, index, onClick }) {
  return (
    <group position={position} key={index} onClick={onClick}>
      <Window width={width - width * 0.05} height={height} position={[0, 0, 0]} lightness={95} selectable={true} />
      <Text position={[0, 0, 11]} text={element} color={"white"} fontSize={25} />
    </group>
  )
}
