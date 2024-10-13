import { cloneElement, useMemo, useRef, useEffect } from "react"
import * as THREE from "three"
// import { Line } from "@react-three/drei"
import { useSpringValue } from "@react-spring/three"

import { Window } from "../3dgui/Window"
import { hsl } from "./helpers"

export function ScrollingWindow({ position, width, height, children }) {
  const pointCount = 1000
  const scroll = useRef(0)

  const curve = useMemo(() => createCapsuleCurve(25, height - 50), [height])

  const texture = useMemo(() => {
    const frames = curve.computeFrenetFrames(pointCount - 1, true)
    const textureArray = new Float32Array([
      ...curve.getSpacedPoints(pointCount - 1).flatMap((v) => [v.x, v.y, v.z, 0.0]),
      ...frames.binormals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
      ...frames.normals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
      // ...frames.tangents.flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ])
    const tex = new THREE.DataTexture(textureArray, pointCount, 3, THREE.RGBAFormat, THREE.FloatType)
    tex.needsUpdate = true
    return tex
  }, [curve, pointCount])

  const uniforms = useRef({
    dataTexture: { value: texture },
    pointCount: { value: pointCount },
    curveLength: { value: curve.getLength() },
    time: { value: 0 },
  }).current

  useEffect(() => {
    uniforms.dataTexture.value = texture
    uniforms.curveLength.value = curve.getLength()
  }, [uniforms, texture, curve])

  const spring = useSpringValue(0, {
    config: { mass: 1, tension: 170, friction: 20 },
    onChange: (result) => (uniforms.time.value = result),
  })

  return (
    <group position={position}>
      <Window
        width={width}
        height={height}
        onWheel={(e) => {
          const newScrollValue = scroll.current + e.deltaY / 4
          scroll.current = newScrollValue
          spring.start(newScrollValue)
        }}
      />
      {/* <Line points={curve.getSpacedPoints(pointCount)} color="yellow" lineWidth={1} />
      {curve.getSpacedPoints(pointCount).map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))} */}
      {children.map((child, i) =>
        cloneElement(child, {
          uniforms: uniforms,
          spring: spring,
          width: width - 20,
          windowHeight: height,
          zPosition: -i * (child.props.height * 1.1),
          color: hsl(220, 100, 50),
          curve: curve,
        })
      )}
    </group>
  )
}

function createCapsuleCurve(radius, height) {
  const curvePath = new THREE.CurvePath()

  const cornerSegments = 10

  // Top Corner
  const topCornerPoints = []
  for (let i = 0; i <= cornerSegments; i++) {
    const angle = Math.PI * (i / cornerSegments)
    topCornerPoints.push(new THREE.Vector3(0, radius * Math.sin(angle) + height / 2, radius * Math.cos(angle)))
  }
  const topCornerCurve = new THREE.CatmullRomCurve3(topCornerPoints)
  curvePath.add(topCornerCurve)

  // Back Straight
  const backStart = new THREE.Vector3(0, height / 2, -radius)
  const backEnd = new THREE.Vector3(0, -height / 2, -radius)
  const backCurve = new THREE.LineCurve3(backStart, backEnd)
  curvePath.add(backCurve)

  // Bottom Corner
  const bottomCornerPoints = []
  for (let i = 0; i <= cornerSegments; i++) {
    const angle = Math.PI * (1 - i / cornerSegments)
    bottomCornerPoints.push(new THREE.Vector3(0, -radius * Math.sin(angle) - height / 2, radius * Math.cos(angle)))
  }
  const bottomCornerCurve = new THREE.CatmullRomCurve3(bottomCornerPoints)
  curvePath.add(bottomCornerCurve)

  // Front Straight
  const frontStart = new THREE.Vector3(0, -height / 2, radius)
  const frontEnd = new THREE.Vector3(0, height / 2, radius)
  const frontCurve = new THREE.LineCurve3(frontStart, frontEnd)
  curvePath.add(frontCurve)

  return curvePath
}
