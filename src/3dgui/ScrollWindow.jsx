import { cloneElement, useMemo, useRef, Children } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"

import { useSpringValue } from "@react-spring/three"

import { Window } from "./Window"
import { hsl, dataTexture } from "./helpers"

export function ScrollWindow({ x = 0, y = 0, z = 0, width, height, children, childHeight, spacing = 5, ...props }) {
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
    <group position={[x, y, z]}>
      <Window
        width={width}
        height={height}
        onWheel={(e) => {
          scroll.current = Math.max(0, scroll.current + e.deltaY / 3)
          spring.start(scroll.current)
        }}
        {...props}
      />
      {Children.map(children, (child, i) => {
        const y = acc - ((child.props.height || childHeight) + spacing) / 2
        acc -= (child.props.height || childHeight) + spacing
        return cloneElement(child, {
          y: y,
          z: 0,
          width: width - 20,
          height: child.props.height || childHeight,
          uniforms: uniforms,
          spring: spring,
          color: hsl(220, 100, 50),
          curve: curve,
          spacing: spacing,
          key: i,
        })
      })}
    </group>
  )
}

function createCapsuleCurve(r, h) {
  const path = new THREE.CurvePath()
  const segs = 10

  // Helper function for generating semi-circle points
  const createSemiCircle = (reverse = false) => {
    const points = []
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI * (reverse ? 1 - i / segs : i / segs)
      const y = reverse ? -r * Math.sin(a) - h / 2 + r : r * Math.sin(a) + h / 2 - r
      points.push(new THREE.Vector3(0, y, r * Math.cos(a)))
    }
    return points
  }

  // Add top, back, bottom, and front segments
  path.add(new THREE.CatmullRomCurve3(createSemiCircle()))
  path.add(new THREE.LineCurve3(new THREE.Vector3(0, h / 2 - r, -r), new THREE.Vector3(0, -h / 2 + r, -r)))
  path.add(new THREE.CatmullRomCurve3(createSemiCircle(true)))
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
