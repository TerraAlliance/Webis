import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls, Stats } from "@react-three/drei"
import { RoundedBox } from "@react-three/drei"

import { Blob } from "./Blob"

import { Webis } from "./Webis/Webis"

export default function App() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", background: "black" }}>
      <Canvas>
        <Stats />
        <OrbitControls enabled={true} />
        <OrthographicCamera makeDefault position={[0, 0, 5000]} far={10000} />
        {/* <pointLight position={[0, 5000, -10000]} intensity={5} decay={0} /> */}
        <directionalLight position={[0, -0.5, 1]} intensity={10} />
        <Webis />
        <Background />
      </Canvas>
    </div>
  )
}

function Background() {
  return (
    <>
      <Blob position={[0, 0, 0]} scale={500} />
      <RoundedBox position={[100, 0, -2000]} args={[5000, 5000, 20]} radius={6}>
        <meshPhysicalMaterial roughness={0} color={"black"} />
      </RoundedBox>
    </>
  )
}
