import { useState, useRef } from "react"
import { MeshBasicMaterial, MeshLambertMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"

import CustomShaderMaterial from "three-custom-shader-material"

import { Text } from "@react-three/drei"

import { roundedbox } from "./helpers"

export function ScrollingDiv({ width, height, zPosition, uniforms, spring, windowHeight, color, curve, text }) {
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
      <Text position={[0, 0, 0]} text={text} fontSize={20} color={"white"}>
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          vertexShader={vertexShader}
          uniforms={{
            ...uniforms,
            offset: { value: new Vector3(0, 8, zPosition) },
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
        visible={false}
        position={spring.to((v) => {
          const value = (zPosition + v) / curve.getLength()
          const t = value - Math.floor(value)
          return [...curve.getPointAt(t)]
        })}
        // position-y={spring.to((val) => zPosition + val + (windowHeight - 50) / 2)}
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

  struct splineData { vec3 point, binormal, normal; };

  splineData getSplineData(float t) {
    float step = 1.0 / 3.0;
    return splineData(
      texture2D(dataTexture, vec2(t, step * 0.5)).rgb,
      texture2D(dataTexture, vec2(t, step * 1.5)).rgb,
      texture2D(dataTexture, vec2(t, step * 2.5)).rgb
    );
  }

  void main() {
    vec3 pos = position;
    pos = (uRotation * vec4(pos, 1.0)).xyz;
    float t = fract((time + offset.z) / curveLength + pos.z / curveLength);
    float wStep = 1.0 / pointCount;
    float tPrev = floor(t / wStep) * wStep + wStep * 0.5;
    splineData splinePrev = getSplineData(tPrev);
    splineData splineNext = getSplineData(tPrev + wStep);

    vec3 P = mix(splinePrev.point, splineNext.point, fract(t / wStep));
    vec3 B = mix(splinePrev.binormal, splineNext.binormal, fract(t / wStep));
    vec3 N = mix(splinePrev.normal, splineNext.normal, fract(t / wStep));

    csm_Position = P + (N * (pos.x + offset.x)) + (B * (pos.y + offset.y));
    csm_Normal = B;
  }
`