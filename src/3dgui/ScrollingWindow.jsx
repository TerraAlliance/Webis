import { cloneElement, useMemo, useRef } from "react"
import * as THREE from "three"
// import { Line } from "@react-three/drei"
import { useSpringValue } from "@react-spring/three"

import { Window } from "./Window"
import { hsl, dataTexture } from "./helpers"

export function ScrollingWindow({ position, width, height, children }) {
  const scroll = useRef(0)
  const pointCount = 1000

  const curve = useMemo(() => createCapsuleCurve(30, height), [height])
  const data = useMemo(() => dataTexture(curve, pointCount), [curve])

  const uniforms = useRef({ data: { value: data }, pointCount: { value: pointCount }, time: { value: 0 } }).current
  uniforms.data.value = data

  let accumulatedHeight = 0

  const spring = useSpringValue(0, {
    config: { mass: 1, tension: 170, friction: 18 },
    onChange: (result) => {
      uniforms.time.value = result
    },
  })

  return (
    <group position={position}>
      <Window
        width={width}
        height={height - 20}
        onWheel={(e) => {
          scroll.current += e.deltaY / 4
          spring.start(scroll.current)
        }}
      />
      {children.map((child, i) => {
        const childHeight = child.props.height + 5
        const zPosition = -accumulatedHeight - childHeight / 2
        accumulatedHeight += childHeight
        return cloneElement(child, {
          key: i,
          uniforms: uniforms,
          spring,
          width: width - 20,
          windowHeight: height,
          yPosition: 0,
          zPosition: zPosition,
          color: hsl(220, 100, 50),
          curve: curve,
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

{
  /* <Line points={curve.getSpacedPoints(pointCount)} color="yellow" lineWidth={1} />
      {curve.getSpacedPoints(pointCount).map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))} */
}
