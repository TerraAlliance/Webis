import { useState, useRef } from "react"
import { MeshBasicMaterial, MeshLambertMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"

import CustomShaderMaterial from "three-custom-shader-material"

import { Text } from "@react-three/drei"

import { roundedbox } from "./helpers"

export function ScrollingDiv2({ width, height, zPosition, uniforms, spring, windowHeight, color, curve, text }) {
  const [hovered, setHover] = useState(false)

  return (
    <>
      <GhostBox zPosition={zPosition} width={width} height={height} windowHeight={windowHeight} spring={spring} setHover={setHover} curve={curve} />
      <mesh geometry={roundedbox(width, 10, height, 5, 1000 / 5)}>
        <CustomShaderMaterial
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          opacity={0.4}
          vertexShader={vertexShader}
          color={hovered ? "red" : color}
          uniforms={{
            ...uniforms,
            offset: { value: new Vector3(0, 0, zPosition) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(0, 0, 0)) },
          }}
        />
      </mesh>
      <Text scale={[1, 1.008, 1.2]} position={[0, 0, 0]} text={text} fontSize={20} color={"white"}>
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          vertexShader={vertexShader}
          uniforms={{
            ...uniforms,
            offset: { value: new Vector3(0, 0, zPosition) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(-Math.PI / 2, 0, -Math.PI)) },
          }}
        />
      </Text>
    </>
  )
}

function GhostBox({ width, height, spring, zPosition, setHover, curve }) {
  const mesh = useRef()

  return (
    <>
      <animated.mesh
        ref={mesh}
        visible={true}
        position={spring.to((v) => {
          const value = (zPosition + v) / curve.getLength()
          const t = value - Math.floor(value)
          return [...curve.getPointAt(t)]
        })}
        // position-z={20}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[width, height, 1]} />
        <meshBasicMaterial color={"hotpink"} transparent={false} opacity={0.2} />
      </animated.mesh>
    </>
  )
}

const vertexShader = `
  uniform sampler2D dataTexture;
  uniform float pointCount;
  uniform float time;
  uniform float curveLength;
  uniform mat4 uRotation;
  uniform vec3 offset;

  void main() {
    vec3 pos = position;
    pos = (uRotation * vec4(pos, 1.0)).xyz;
    float t = fract((time + offset.z) / curveLength + pos.z / curveLength);

    vec3 point = texture2D(dataTexture, vec2(t, (0.5) / 4.)).xyz;
    vec3 a = texture2D(dataTexture, vec2(0.0, (1. + 0.5) / 4.)).xyz;
    vec3 b = texture2D(dataTexture, vec2(0.0, (2. + 0.5) / 4.)).xyz;
    vec3 c = texture2D(dataTexture, vec2(0.0, (3. + 0.5) / 4.)).xyz;
    mat3 basis = mat3(a, b, c);

    csm_Position = point + (b * pos.x) + (c * (pos.y));
    csm_Normal = c;
  }
`
