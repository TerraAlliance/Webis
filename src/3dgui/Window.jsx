import { useState } from "react"
import { RoundedBox } from "@react-three/drei"

export function Window({ position, width, height, roughness = 0.1, hue = 0, lightness = 100, selectable = false, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <RoundedBox
      position={position}
      args={[width, height, 10]}
      radius={5}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => (e.stopPropagation(), setHovered(false))}
      onClick={(e) => (e.stopPropagation(), onClick && onClick())}
    >
      <meshPhysicalMaterial
        reflectivity={0}
        transmission={1}
        roughness={selectable && hovered ? 0.5 : roughness}
        color={selectable && hovered ? hsl(hue, 100, lightness - 2) : hsl(hue, 100, lightness)}
      />
      {/* <meshStandardMaterial transparent={true} opacity={0.4} color="white" /> */}
    </RoundedBox>
  )
}

function hsl(hue, saturation, lightness) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
