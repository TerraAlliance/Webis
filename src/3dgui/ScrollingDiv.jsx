import { useState, useRef, cloneElement } from "react"
import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"

import CustomShaderMaterial from "three-custom-shader-material"
import { Text } from "@react-three/drei"
import { roundedbox, hsl } from "./helpers"

export function ScrollingDiv({ width, height, yPosition, zPosition, uniforms, spring, color, curve, text, alignment, children }) {
  let accumulatedHeight = 0
  return (
    <>
      <Div zPosition={zPosition} yPosition={yPosition} width={width} height={height} spring={spring} curve={curve} color={color} uniforms={uniforms} />
      <Text
        position-x={alignment === "left" ? -width / 2 : alignment === "right" ? width / 2 : 0}
        text={text}
        fontSize={20}
        color={"white"}
        anchorX={alignment}
      >
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          vertexShader={vertexShader}
          uniforms={{
            ...uniforms,
            curveLength: { value: curve.getLength() },
            offset: { value: new Vector3(0, yPosition, zPosition) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(-Math.PI / 2, 0, -Math.PI)) },
          }}
        />
      </Text>
      {children &&
        children.map((child, i) => {
          const childHeight = child.props.height + 5
          const zPosition = -accumulatedHeight - childHeight / 2
          accumulatedHeight += childHeight
          return cloneElement(child, {
            key: i,
            uniforms: uniforms,
            spring,
            width: width - 20,
            windowHeight: height,
            yPosition: 5,
            zPosition: zPosition - 40,
            color: hsl(220, 100, 50),
            curve: curve,
          })
        })}
    </>
  )
}

function Div({ width, height, spring, zPosition, yPosition, curve, color, uniforms }) {
  const [hovered, setHover] = useState(false)

  return (
    <>
      <mesh geometry={roundedbox(width, 8, height, 4, Math.ceil(height / 10))}>
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          transparent={true}
          opacity={0.3}
          vertexShader={vertexShader}
          color={hovered ? "red" : color}
          wireframe={false}
          uniforms={{
            ...uniforms,
            curveLength: { value: curve.getLength() },
            offset: { value: new Vector3(0, yPosition - 8, zPosition) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(0, 0, 0)) },
          }}
        />
      </mesh>
      <animated.mesh
        visible={false}
        position={spring.to((v) => {
          const value = (zPosition + v) / curve.getLength()
          const t = value - Math.floor(value)
          const point = curve.getPointAt(t)
          return [point.x, point.y, point.z + yPosition]
        })}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHover(false)
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={"hotpink"} />
      </animated.mesh>
    </>
  )
}

const vertexShader = `
  uniform sampler2D data;
  uniform float pointCount;
  uniform float time;
  uniform float curveLength;
  uniform mat4 uRotation;
  uniform vec3 offset;

  void main() {
    vec3 pos = (uRotation * vec4(position, 1.0)).xyz;
    pos += offset;
    float t = fract(time / curveLength + pos.z / curveLength);

    vec3 point = texture2D(data, vec2(t, (0.5) / 4.)).xyz;
    vec3 a = texture2D(data, vec2(t, (1. + 0.5) / 4.)).xyz;
    vec3 b = texture2D(data, vec2(t, (2. + 0.5) / 4.)).xyz;
    vec3 c = texture2D(data, vec2(t, (3. + 0.5) / 4.)).xyz;
    // mat3 basis = mat3(a, b, c);

    csm_Position = point + (b * pos.x) + (c * (pos.y));
    csm_Normal = c;
  }
`
