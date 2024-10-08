import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Line } from "@react-three/drei"
import CustomShaderMaterial from "three-custom-shader-material"

import { roundedbox } from "./helpers"

// const meshUniforms = createUniforms(10, 870, 400, [0, 0, 0], [0, 0, 0])

export function ScrollingDiv({ width, height, time }) {
  const meshUniforms = {
    uSpatialTexture: { value: texture },
    uTextureSize: { value: new THREE.Vector2(400 + 1, 4) },
    uCurveLength: { value: curve.getLength() },
    uPosition: { value: new THREE.Vector3(0, 0, 0) },
    uRotation: { value: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, 0, 0)) },
    uTime: { value: time },
  }

  // useFrame((_, delta) => {
  //   meshUniforms.uTime.value += delta * 1
  // })

  return (
    <>
      <>
        <Line points={createCurvePoints(20, 870)} color="yellow" lineWidth={1} />
        {createCurvePoints(20, 870).map((point, index) => (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}
        <mesh geometry={roundedbox(width, 10, height, 5, 1000 / 5)}>
          <meshNormalMaterial />
          <CustomShaderMaterial baseMaterial={THREE.MeshLambertMaterial} vertexShader={vertexShader} uniforms={meshUniforms} color={"blueviolet"} />
        </mesh>
      </>
    </>
  )
}

const curve = new THREE.CatmullRomCurve3(createCurvePoints(10, 870), true)
const points = curve.getSpacedPoints(400)
const frames = curve.computeFrenetFrames(400, true)

const dataArray = new Float32Array([
  ...points.flatMap((v) => [v.x, v.y, v.z, 0.0]),
  ...frames.binormals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
  ...frames.normals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
  ...frames.tangents.flatMap((v) => [v.x, v.y, v.z, 0.0]),
])

const texture = new THREE.DataTexture(dataArray, 400 + 1, 4, THREE.RGBAFormat, THREE.FloatType)
texture.needsUpdate = true

// function createUniforms(radius, height, numPoints, position, rotation) {
//   const curve = new THREE.CatmullRomCurve3(createCurvePoints(radius, height), true)
//   const cPoints = curve.getSpacedPoints(numPoints)
//   const cObjects = curve.computeFrenetFrames(numPoints, true)

//   const dataArray = new Float32Array([
//     ...cPoints.flatMap((v) => [v.x, v.y, v.z, 0.0]),
//     ...cObjects.binormals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
//     ...cObjects.normals.flatMap((v) => [v.x, v.y, v.z, 0.0]),
//     ...cObjects.tangents.flatMap((v) => [v.x, v.y, v.z, 0.0]),
//   ])

//   const texture = new THREE.DataTexture(dataArray, numPoints + 1, 4, THREE.RGBAFormat, THREE.FloatType)
//   texture.needsUpdate = true

//   return {
//     uSpatialTexture: { value: texture },
//     uTextureSize: { value: new THREE.Vector2(numPoints + 1, 4) },
//     uCurveLength: { value: curve.getLength() },
//     uPosition: { value: new THREE.Vector3(...position) },
//     uRotation: { value: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)) },
//     uTime: { value: 0 },
//   }
// }

function createCurvePoints(radius, height) {
  const points = []

  const cornersegments = 5
  const straightsegments = 5

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
    float t = fract(uTime * 0.1 + pos.z / uCurveLength);
    float wStep = 1. / uTextureSize.x;
    float tPrev = floor(t / wStep) * wStep + wStep * 0.5;
    splineData splinePrev = getSplineData(tPrev);
    splineData splineNext = getSplineData(tPrev + wStep);

    vec3 P = mix(splinePrev.point, splineNext.point, fract(t / wStep));
    vec3 B = mix(splinePrev.binormal, splineNext.binormal, fract(t / wStep));
    vec3 N = mix(splinePrev.normal, splineNext.normal, fract(t / wStep));

    vec3 localPos = pos + uPosition;
    csm_Position = P + (N * localPos.x) + (B * localPos.y) ;
    csm_Normal = B;
  }
`
