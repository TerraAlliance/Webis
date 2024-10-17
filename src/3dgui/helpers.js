import { Shape, ExtrudeGeometry, DataTexture, RepeatWrapping, LinearFilter, RGBAFormat, FloatType } from "three"

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
  const texture = new DataTexture(dataArray, pointCount, 4, RGBAFormat, FloatType)
  texture.wrapS = RepeatWrapping
  texture.wrapY = RepeatWrapping
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}
