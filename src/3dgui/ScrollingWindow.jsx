import { cloneElement, useMemo, useRef, useEffect } from "react"
import * as THREE from "three"
// import { Line } from "@react-three/drei"
import { useSpringValue } from "@react-spring/three"

import { Window } from "./Window"
import { hsl } from "./helpers"

export function ScrollingWindow({ position, width, height, children }) {
  const pointCount = 1000
  const scroll = useRef(0)
  const curve = useMemo(() => createCapsuleCurve(20, height - 30), [height])

  const dataTexture = useMemo(() => {
    const points = curve.getSpacedPoints(pointCount)
    const frames = curve.computeFrenetFrames(pointCount, true)
    const dataArray = new Float32Array([
      ...points.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
      ...frames.tangents.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
      ...frames.normals.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
      ...frames.binormals.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ])
    return new THREE.DataTexture(dataArray, pointCount, 4, THREE.RGBAFormat, THREE.FloatType)
  }, [curve])

  dataTexture.wrapS = THREE.RepeatWrapping
  dataTexture.wrapY = THREE.RepeatWrapping
  dataTexture.magFilter = THREE.LinearFilter
  dataTexture.needsUpdate = true

  const uniforms = useRef({
    dataTexture: { value: dataTexture },
    pointCount: { value: pointCount },
    curveLength: { value: curve.getLength() },
    time: { value: 0 },
  }).current

  useEffect(() => {
    uniforms.dataTexture.value = dataTexture
    uniforms.curveLength.value = curve.getLength()
  }, [uniforms, curve, dataTexture])

  const spring = useSpringValue(0, {
    config: { mass: 1, tension: 170, friction: 20 },
    onChange: (result) => (uniforms.time.value = result),
  })

  const handleWheel = (e) => {
    scroll.current += e.deltaY / 4
    spring.start(scroll.current)
  }

  return (
    <group position={position}>
      <Window width={width} height={height} onWheel={handleWheel} />
      {children.map((child, i) =>
        cloneElement(child, {
          key: i,
          uniforms,
          spring,
          width: width - 20,
          windowHeight: height,
          zPosition: -i * (child.props.height * 1.1),
          color: hsl(220, 100, 50),
          curve,
        })
      )}
    </group>
  )
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
