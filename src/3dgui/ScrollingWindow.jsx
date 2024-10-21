import { cloneElement, useMemo, useRef } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"

import { useSpringValue } from "@react-spring/three"

import { Window } from "./Window"
import { hsl, dataTexture } from "./helpers"

export function ScrollingWindow({ position, width, height, children, spacing = 5 }) {
  const scroll = useRef(0)
  const pointCount = 1000

  const curve = useMemo(() => createCapsuleCurve(30, height + 15), [height])
  const data = useMemo(() => dataTexture(curve, pointCount), [curve])

  const uniforms = useRef({
    data: { value: data },
    pointCount: { value: pointCount },
    curveLength: { value: curve.getLength() },
    time: { value: 0 },
  }).current
  uniforms.data.value = data
  uniforms.curveLength.value = curve.getLength()

  let acc = 0

  const events = useThree((state) => state.events)

  const spring = useSpringValue(0, {
    config: { mass: 1, tension: 170, friction: 18 },
    onChange: (result) => ((uniforms.time.value = result), events.update()),
  })

  return (
    <group position={position}>
      <Window
        width={width}
        height={height}
        onWheel={(e) => {
          scroll.current = Math.max(0, scroll.current + e.deltaY / 3)
          spring.start(scroll.current)
        }}
      />
      {children &&
        (Array.isArray(children) ? children : [children]).map((child, i) => {
          const y = acc - (child.props.height + spacing) / 2
          acc -= child.props.height + spacing
          return cloneElement(child, {
            key: i,
            uniforms: uniforms,
            spring,
            width: width - 20,
            z: 0,
            y: y,
            color: hsl(220, 100, 50),
            curve: curve,
            spacing: spacing,
          })
        })}
    </group>
  )
}

function createCapsuleCurve(r, h) {
  const path = new THREE.CurvePath()
  const segs = 10

  // Top
  const topPts = []
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI * (i / segs)
    topPts.push(new THREE.Vector3(0, r * Math.sin(a) + h / 2 - r, r * Math.cos(a)))
  }
  path.add(new THREE.CatmullRomCurve3(topPts))

  // Back
  path.add(new THREE.LineCurve3(new THREE.Vector3(0, h / 2 - r, -r), new THREE.Vector3(0, -h / 2 + r, -r)))

  // Bottom
  const botPts = []
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI * (1 - i / segs)
    botPts.push(new THREE.Vector3(0, -r * Math.sin(a) - h / 2 + r, r * Math.cos(a)))
  }
  path.add(new THREE.CatmullRomCurve3(botPts))

  // Front
  path.add(new THREE.LineCurve3(new THREE.Vector3(0, -h / 2 + r, r), new THREE.Vector3(0, h / 2 - r, r)))

  return path
}

/* <Line points={curve.getSpacedPoints(50)} color="yellow" lineWidth={1} />
      {curve.getSpacedPoints(50).map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))} */

// import { Line } from "@react-three/drei"
