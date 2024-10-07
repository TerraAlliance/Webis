import { Html } from "@react-three/drei"
import { Window } from "../3dgui/Window"

export function Display({ position, width, height }) {
  return (
    <group position={position}>
      <Window width={width} height={height} />
      <Html
        position={[0, 0, 11]}
        distanceFactor={200}
        transform={true}
        occlude={true}
        pointerEvents="none"
        style={{ width: width * 2 - 40 + "px", height: height * 2 - 40 + "px", backgroundColor: "white" }}
      >
        <Element />
        <span style={{ fontSize: "100px", pointerEvents: "auto" }}>Text </span>
        <span style={{ fontSize: "100px", pointerEvents: "auto" }}>Text </span>
        <span style={{ fontSize: "100px", pointerEvents: "auto" }}>Text </span>
        <div style={{ width: "200px", height: "200px", background: "blue" }} />
        <div style={{ width: "200px", height: "200px", background: "red" }} />
        <div style={{ width: "200px", height: "200px", background: "green" }} />
        <div style={{ width: "200px", height: "200px", background: "yellow" }} />
      </Html>
    </group>
  )
}

function Element() {
  return (
    <>
      <span style={{ fontSize: "100px" }}>Text </span>
    </>
  )
}
