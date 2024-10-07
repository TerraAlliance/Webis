// import { cloneElement } from "react"
// import { Switch } from "@legendapp/state/react"
// import { Text } from "@react-three/drei"

import { Window } from "../3dgui/Window"
import { app } from "./state"

export function Diagram({ position, width, height }) {
  console.log(app.elements.get())
  return (
    <group position={position}>
      <Window width={width} height={height} />
      {/* <Elements width={width} height={height} /> */}
      <ScrollingDivs />
      {/* <ScrollingText /> */}
    </group>
  )
}

// function Elements({ width, height }) {
//   console.log(renderElements(app.elements.get(), 0))
//   return (
//     <>
//       <Element type={"Body"} width={width - 20} height={height - 20}>
//         {renderElements(app.elements.get(), 0)}
//       </Element>
//     </>
//   )
// }

// const componentMap = { Element: Element }

// const renderElements = (elements) => {
//   return Object.entries(elements).map(([key, value]) => {
//     const { component: componentName, children, ...props } = value
//     const Component = componentMap[componentName]

//     const childElements = children ? renderElements(children) : null

//     return (
//       <Component key={key} {...props}>
//         {childElements}
//       </Component>
//     )
//   })
// }

// function Element({ position, type, width, height, children, lightness = 90 }) {
//   return (
//     <group position={position}>
//       <group position={[0, 0, 20]}>
//         <StartTag position={[-width / 2 + 45, height / 2 - 15, 11]} type={type} />
//         <Switch value={type}>
//           {{
//             Body: () => <EndTag position={[-width / 2 + 45, -height / 2 + 15, 11]} type={type} />,
//             Span: () => <EndTag position={[width / 2 - 45, height / 2 - 15, 11]} type={type} />,
//             default: () => <EndTag position={[-width / 2 + 45, -height / 2 + 15, 11]} type={type} />,
//           }}
//         </Switch>
//         <Window width={width} height={height} lightness={lightness} selectable={true} />
//       </group>
//       <group position={[0, 0, 20]}>
//         {children &&
//           children.map((child, i) =>
//             cloneElement(child, {
//               key: i,
//               lightness: lightness - 5,
//               width: width - 50,
//               height: height / children.length - 40,
//               position: [0, height / 2 - height / children.length / 2 - (height / children.length) * i, 0],
//             })
//           )}
//       </group>
//     </group>
//   )
// }

// function StartTag({ position, type }) {
//   return <Text position={position} text={`<${type}>`} color={"white"} fontSize={20} />
// }

// function EndTag({ position, type }) {
//   return <Text position={position} text={`</${type}>`} color={"white"} fontSize={20} />
// }

import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Line } from "@react-three/drei"

const vertexShader = `
  uniform sampler2D uSpatialTexture;
  uniform vec2 uTextureSize;
  uniform float uTime;
  uniform float uCurveLength;
  uniform mat4 uRotation;
  uniform vec3 uPosition;

  struct splineData { vec3 point, binormal, normal; };

  splineData getSplineData(float t) {
    float step = 1. / uTextureSize.y;
    return splineData(
      texture2D(uSpatialTexture, vec2(t, step * 0.5)).rgb,
      texture2D(uSpatialTexture, vec2(t, step * 1.5)).rgb,
      texture2D(uSpatialTexture, vec2(t, step * 2.5)).rgb
    );
  }

  void main() {
    vec3 pos = position;
     pos = (uRotation * vec4(pos, 1.0)).xyz;
    float t = fract(uTime * 0.1 + pos.z * 1.0 / uCurveLength);
    float wStep = 1. / uTextureSize.x;
    float tPrev = floor(t / wStep) * wStep + wStep * 0.5;
    splineData splinePrev = getSplineData(tPrev);
    splineData splineNext = getSplineData(tPrev + wStep);

    vec3 P = mix(splinePrev.point, splineNext.point, fract(t / wStep));
    vec3 B = mix(splinePrev.binormal, splineNext.binormal, fract(t / wStep));
    vec3 N = mix(splinePrev.normal, splineNext.normal, fract(t / wStep));

    vec3 localPos = pos + uPosition;
    csm_Position = P + (N * localPos.x) + (B  * localPos.y);
    csm_Normal = N; 
  }
`

function createCurvePoints(radius, height) {
  const points = []

  const cornersegments = 10
  const straightsegments = 10

  //Top
  for (let i = 0; i <= cornersegments; i++) {
    const angle = Math.PI * (i / cornersegments)
    points.push(new THREE.Vector3(0, radius * Math.sin(angle) + height / 2, radius * Math.cos(angle)))
  }
  //Back
  for (let i = 1; i <= straightsegments - 1; i++) {
    const t = i / straightsegments
    points.push(new THREE.Vector3(0, (1 - t) * height - height / 2, -radius))
  }

  //Bottom
  for (let i = cornersegments; i >= 0; i--) {
    const angle = Math.PI * (i / cornersegments)
    points.push(new THREE.Vector3(0, -radius * Math.sin(angle) - height / 2, radius * Math.cos(angle)))
  }
  //Front
  for (let i = 1; i <= straightsegments - 1; i++) {
    const t = i / straightsegments
    points.push(new THREE.Vector3(0, t * height - height / 2, radius))
  }

  return points
}

import CustomShaderMaterial from "three-custom-shader-material"

function createUniforms(radius, height, numPoints, position, rotation) {
  const curve = new THREE.CatmullRomCurve3(createCurvePoints(radius, height), true)
  const cPoints = curve.getSpacedPoints(numPoints)
  const cObjects = curve.computeFrenetFrames(numPoints, true)

  const dataArray = new Float32Array([
    ...cPoints.flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...cObjects.binormals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...cObjects.normals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...cObjects.tangents.flatMap((v) => [v.x, v.y, v.z, 0.0]),
  ])

  const texture = new THREE.DataTexture(dataArray, numPoints + 1, 4, THREE.RGBAFormat, THREE.FloatType)
  texture.needsUpdate = true

  return {
    uSpatialTexture: { value: texture },
    uTextureSize: { value: new THREE.Vector2(numPoints + 1, 4) },
    uCurveLength: { value: curve.getLength() },
    uPosition: { value: new THREE.Vector3(...position) },
    uRotation: { value: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)) },
    uTime: { value: -0.7 },
  }
}

// const textUniforms = createUniforms(10, 870, 100, [0, 6, 0], [-Math.PI / 2, 0, -Math.PI])
const meshUniforms = createUniforms(10, 870, 400, [0, 0, 0], [0, 0, 0])

import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

function createBoxWithRoundedEdges(width, height, depth, radius0, smoothness, steps = 1) {
  let shape = new THREE.Shape()
  let eps = 0.00001
  const radius = radius0 - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true)
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)

  let geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: steps,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
  })

  geometry.center()

  return geometry
}

let zOffset = 0

const boxes = [120, 120, 120, 120, 120, 120].map((height) => {
  const box = createBoxWithRoundedEdges(700, 10, height, 5, 2, height / 5)
  box.translate(0, 0, zOffset - height / 2)
  zOffset -= height + 10
  return box
})

let zOffset1 = 0

const boxes2 = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40].map((height) => {
  const box = createBoxWithRoundedEdges(700, 10, height, 5, 2, height / 5)
  box.translate(0, 10, zOffset1 - height / 2)
  zOffset1 -= height + 10
  return box
})

const combined = mergeGeometries(boxes)
const combined2 = mergeGeometries(boxes2)

function ScrollingDivs() {
  useFrame((_, delta) => {
    meshUniforms.uTime.value += delta * 0
  })

  return (
    <>
      <>
        <Line points={createCurvePoints(20, 870)} color="yellow" lineWidth={1} />
        {createCurvePoints(20, 870, 2).map((point, index) => (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}
        {/* <mesh geometry={combined}>
          <CustomShaderMaterial
            baseMaterial={THREE.MeshPhysicalMaterial}
            vertexShader={vertexShader}
            uniforms={meshUniforms}
            transmission={1}
            roughness={0.3}
            color={hsl(0, 100, 90)}
          />
        </mesh>

        <mesh geometry={combined2}>
          <CustomShaderMaterial
            baseMaterial={THREE.MeshPhysicalMaterial}
            vertexShader={vertexShader}
            uniforms={meshUniforms}
            transmission={1}
            roughness={0.3}
            color={hsl(0, 100, 80)}
          />
        </mesh> */}
        <mesh geometry={combined}>
          <CustomShaderMaterial
            baseMaterial={THREE.MeshBasicMaterial}
            vertexShader={vertexShader}
            uniforms={meshUniforms}
            transparent={true}
            opacity={0.2}
            color={hsl(0, 100, 50)}
          />
        </mesh>

        <mesh geometry={combined2}>
          <CustomShaderMaterial
            baseMaterial={THREE.MeshBasicMaterial}
            vertexShader={vertexShader}
            uniforms={meshUniforms}
            transparent={true}
            opacity={0.2}
            color={hsl(0, 100, 50)}
          />
        </mesh>
      </>
    </>
  )
}

// function ScrollingText() {
//   useFrame(() => {
//     // textUniforms.uTime.value += delta * 0.3
//   })

//   return (
//     <>
//       <>
//         <Text text={"Hello this is a text"} fontSize={30} color={"black"}>
//           <CustomShaderMaterial baseMaterial={THREE.MeshBasicMaterial} side={2} vertexShader={vertexShader} uniforms={textUniforms} />
//         </Text>
//       </>
//     </>
//   )
// }

function hsl(hue, saturation, lightness) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
