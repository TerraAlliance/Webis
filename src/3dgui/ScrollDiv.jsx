import { useState, cloneElement, Children } from "react"
import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"
import { Switch, Show } from "@legendapp/state/react"
import { RoundedBox } from "@react-three/drei"
import CustomShaderMaterial from "three-custom-shader-material"

import { flowShader, hsl, filterChildrenByType } from "./helpers"

const AnimatedShow = animated(Show)

export function ScrollDiv({ y, z, width, height, uniforms, spring, curve, children, spacing, level = 0, hue = 220, selected, ...props }) {
  let acc = 0
  const divChildren = filterChildrenByType(children, "ScrollDiv")
  const totalHeight = divChildren.reduce((a, v) => a + v.props.height + spacing, 0)
  const singleLine = divChildren.length > 0 ? false : true

  return (
    <AnimatedShow
      if={spring.to((v) => {
        const value = (y + v) / curve.getLength()
        return value < 0.025 + height / curve.getLength() / 2 && value > -0.475 - height / curve.getLength()
      })}
    >
      <Div y={y} z={z} width={width} height={height} spring={spring} curve={curve} level={level} uniforms={uniforms} selected={selected} hue={hue} {...props} />
      {Children.map(Children.toArray(children), (child, i) => {
        return (
          <Switch key={i} value={child.type.name}>
            {{
              ScrollDiv: () => {
                const yOffset = -acc + totalHeight / 2 - (child.props.height + spacing) / 2
                acc += child.props.height + spacing
                const childY = divChildren.length > 1 ? y + yOffset : y
                return cloneElement(child, {
                  y: childY,
                  z: z + 1,
                  uniforms: uniforms,
                  spring: spring,
                  width: width - 20,
                  curve: curve,
                  level: level + 1,
                })
              },
              ScrollText: () => cloneElement(child, { y: y, z: z + 1, width: width, height: height, uniforms: uniforms, curve: curve }),
              ScrollTag: () => cloneElement(child, { y: y, z: z + 1, width: width, height: height, uniforms: uniforms, singleLine: singleLine, curve: curve }),
            }}
          </Switch>
        )
      })}
    </AnimatedShow>
  )
}

function Div({ width, height, spring, y, z, curve, level, uniforms, selected, hue, ...props }) {
  const [hovered, setHover] = useState(false)

  return (
    <>
      <RoundedBox args={[width, 8, height]} radius={4} smoothness={1} steps={Math.ceil(height / 10)} bevelSegments={1}>
        <CustomShaderMaterial
          baseMaterial={MeshBasicMaterial}
          transparent={true}
          opacity={hovered || selected ? 0.4 : 0.2}
          vertexShader={flowShader}
          color={hovered || selected ? "red" : hsl(hue + level * 30, 100, 50)}
          uniforms={{
            ...uniforms,
            offset: { value: new Vector3(0, z - 6, y) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(0, 0, 0)) },
          }}
          key={y}
        />
      </RoundedBox>
      <animated.mesh
        visible={false}
        position={spring.to((v) => {
          const value = (y + v) / curve.getLength()
          const t = value - Math.floor(value)
          const point = curve.getPointAt(t)
          return [point.x, point.y, point.z + z]
        })}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => (e.stopPropagation(), setHover(false))}
        {...props}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={"hotpink"} />
      </animated.mesh>
    </>
  )
}
