import { Children } from "react"
import { Shape, ExtrudeGeometry, DataTexture, RepeatWrapping, LinearFilter, RGBAFormat, HalfFloatType } from "three"
import { toHalfFloat } from "three/src/extras/DataUtils.js"

export function hsl(hue, saturation, lightness) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function roundedbox(width, height, depth, radius0, steps, smoothness = 2) {
  let shape = new Shape()
  let eps = 0.00001
  const radius = radius0 - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true)
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)

  let geometry = new ExtrudeGeometry(shape, {
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

export function dataTexture(curve, pointCount) {
  const points = curve.getSpacedPoints(pointCount)
  const frames = curve.computeFrenetFrames(pointCount, true)
  const dataArray = new Float32Array([
    ...points.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...frames.tangents.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...frames.normals.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
    ...frames.binormals.slice(0, pointCount).flatMap((v) => [v.x, v.y, v.z, 0.0]),
  ])
  const halfFloatData = new Uint16Array(dataArray.length)
  for (let i = 0; i < dataArray.length; i++) halfFloatData[i] = toHalfFloat(dataArray[i])
  const texture = new DataTexture(halfFloatData, pointCount, 4, RGBAFormat, HalfFloatType)
  texture.wrapS = RepeatWrapping
  texture.wrapY = RepeatWrapping
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

export const flowShader = `
  uniform sampler2D data;
  uniform float pointCount;
  uniform float time;
  uniform float curveLength;
  uniform mat4 uRotation;
  uniform vec3 offset;

  void main() {
    vec3 pos = (uRotation * vec4(position, 1.0)).xyz + offset;
    float t = (time + pos.z) / curveLength;

    float min = -0.475;
    float max = 0.025;
    t = clamp(t, min, max);

    vec3 point = texture2D(data, vec2(t, (0.5) / 4.)).xyz;
    vec3 a = texture2D(data, vec2(t, (1. + 0.5) / 4.)).xyz;
    vec3 b = texture2D(data, vec2(t, (2. + 0.5) / 4.)).xyz;
    vec3 c = texture2D(data, vec2(t, (3. + 0.5) / 4.)).xyz;
      
    csm_Position = point + (b * pos.x) + (c * pos.y);
    csm_Normal = c;
  }
`

export function countChildrenOfType(children, type) {
  return Children.toArray(children).filter((child) => child.type.name === type).length
}

export function filterChildrenByType(children, type) {
  return Children.toArray(children).filter((child) => {
    return child.type.displayName === type
  })
}
