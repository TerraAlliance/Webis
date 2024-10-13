import { RoundedBox } from "@react-three/drei"

export function Window({ position, width, height, ...props }) {
  return (
    <RoundedBox position={position} args={[width, height, 40]} radius={20} {...props}>
      <meshLambertMaterial transparent={true} opacity={1} color="purple" />
    </RoundedBox>
  )
}
