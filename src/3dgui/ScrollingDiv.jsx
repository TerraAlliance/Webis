import { useState, cloneElement } from "react"
import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"

import CustomShaderMaterial from "three-custom-shader-material"
import { roundedbox, flowShader } from "./helpers"

export function ScrollingDiv({ width, height, yPosition, zPosition, uniforms, spring, color, curve, children }) {
  let accumulator = 0
  return (
    <>
      <Div zPosition={zPosition} yPosition={yPosition} width={width} height={height} spring={spring} curve={curve} color={color} uniforms={uniforms} />
      {children &&
        (Array.isArray(children) ? children : [children]).map((child, i) => {
          const childHeight = child.props.height || 0
          const z = -accumulator - childHeight / 2
          accumulator += childHeight
          return cloneElement(child, {
            key: i,
            uniforms: uniforms,
            spring,
            width: width,
            height: height,
            windowHeight: height,
            yPosition: 1,
            zPosition: zPosition + z,
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
          opacity={hovered ? 0.5 : 0.2}
          vertexShader={flowShader}
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
