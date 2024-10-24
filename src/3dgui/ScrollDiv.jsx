import { useState, cloneElement, Children } from "react"
import { MeshBasicMaterial, Vector3, Matrix4, Euler } from "three"
import { animated } from "@react-spring/three"
import { Switch, Show } from "@legendapp/state/react"
import { RoundedBox } from "@react-three/drei"
import CustomShaderMaterial from "three-custom-shader-material"

import { flowShader, hsl, filterChildrenByType } from "./helpers"

const AnimatedShow = animated(Show)

export function ScrollDiv({ y, z, width, height, wheight, uniforms, spring, curve, children, spacing, level = 0, hue = 220, selected, ...props }) {
  let acc = 0
  const divChildren = filterChildrenByType(children, "ScrollDiv")
  const totalHeight = divChildren.reduce((a, v) => a + v.props.height + spacing, 0)
  const singleLine = divChildren.length > 0 ? false : true

  return (
    <AnimatedShow
      if={spring.to((v) => {
        const value = (y + v) / curve.getLength()
        return value < 0.02 + height / curve.getLength() / 2 && value > -0.48 - height / curve.getLength()
      })}
    >
      <Div
        y={y}
        z={z}
        width={width}
        height={height}
        wheight={wheight}
        spring={spring}
        level={level}
        uniforms={uniforms}
        selected={selected}
        hue={hue}
        {...props}
      />
      {Children.map(Children.toArray(children), (child, i) => {
        const yOffset = -acc + totalHeight / 2 - (child.props.height + spacing) / 2
        if (child.type.displayName === "ScrollDiv") acc += child.props.height + spacing
        const childY = divChildren.length > 1 ? y + yOffset : y
        return (
          <Switch key={i} value={child.type.displayName}>
            {{
              ScrollDiv: () => {
                return cloneElement(child, {
                  y: childY,
                  z: z,
                  uniforms: uniforms,
                  spring: spring,
                  width: width - 20,
                  wheight: wheight,
                  curve: curve,
                  level: level + 1,
                })
              },
              ScrollText: () => cloneElement(child, { y: y, z: z + 5, width: width, height: height, uniforms: uniforms, curve: curve }),
              ScrollTag: () => cloneElement(child, { y: y, z: z + 5, width: width, height: height, uniforms: uniforms, singleLine: singleLine, curve: curve }),
            }}
          </Switch>
        )
      })}
    </AnimatedShow>
  )
}

function Div({ width, height, wheight, spring, y, z, level, uniforms, selected, hue, ...props }) {
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
            offset: { value: new Vector3(0, z, y) },
            uRotation: { value: new Matrix4().makeRotationFromEuler(new Euler(0, 0, 0)) },
          }}
          key={[y]}
          depthWrite={false}
        />
      </RoundedBox>
      <animated.mesh
        visible={false}
        position={spring.to((v) => [0, y + v + wheight / 2, z + level * 20 + 20])}
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

ScrollDiv.displayName = "ScrollDiv"
