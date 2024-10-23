import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"

import CustomShaderMaterial from "three-custom-shader-material"
import { Text } from "@react-three/drei"
// import { Text } from "./Text"
import { flowShader } from "./helpers"

export function ScrollText({ y, z, width, height, uniforms, fontSize = 20, color, location, ...props }) {
  const left = -width / 2 + 5
  const right = width / 2 - 5
  const top = height / 2 - 15
  const bottom = -height / 2 + 15

  const locationMap = {
    left: [left, 0],
    right: [right, 0],
    top: [0, top],
    bottom: [0, bottom],
    topLeft: [left, top],
    topRight: [right, top],
    bottomLeft: [left, bottom],
    bottomRight: [right, bottom],
  }

  const [xPos, yPos] = locationMap[location] || [0, 0]

  return (
    <Text position-x={xPos} fontSize={fontSize} color={color} yPos={yPos} location={location} {...props}>
      <CustomShaderMaterial
        baseMaterial={MeshBasicMaterial}
        vertexShader={flowShader}
        uniforms={{
          ...uniforms,
          offset: { value: new Vector3(0, z, y + yPos) },
          uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(-Math.PI / 2, 0, -Math.PI)) },
        }}
        key={[location, yPos, y]}
      />
    </Text>
  )
}
