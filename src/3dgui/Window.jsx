import { useState } from "react"
import { RoundedBox } from "@react-three/drei"

export function Window({ position, width, height, onClick }) {
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
      <meshLambertMaterial transparent={true} opacity={0.3} color="black" metalness={0} />
    </RoundedBox>
  )
}
