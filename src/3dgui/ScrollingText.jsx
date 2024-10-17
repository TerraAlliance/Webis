import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"

import CustomShaderMaterial from "three-custom-shader-material"
import { Text } from "@react-three/drei"
import { flowShader } from "./helpers"

export function ScrollingText({ width, height, yPosition, zPosition, uniforms, curve, ...props }) {
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

  const [xPos, yPos] = locationMap[props?.location] || [0, 0]

  return (
    <Text position-x={xPos} anchorX={props?.anchorX} {...props}>
      <CustomShaderMaterial
        baseMaterial={MeshBasicMaterial}
        vertexShader={flowShader}
        uniforms={{
          ...uniforms,
          curveLength: { value: curve.getLength() },
          offset: { value: new Vector3(0, yPosition, zPosition + yPos) },
          uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(-Math.PI / 2, 0, -Math.PI)) },
        }}
      />
    </Text>
  )
}
