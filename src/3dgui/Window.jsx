import { RoundedBox } from "@react-three/drei"

export function Window({ position, width, height, ...props }) {
  return (
    <RoundedBox position={position} args={[width, height, 30]} radius={10} {...props}>
      <meshBasicMaterial transparent={true} opacity={0.2} color="black" />
    </RoundedBox>
  )
}
