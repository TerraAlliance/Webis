import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls, Stats } from "@react-three/drei"

// import { Stats } from "@react-three/drei"
// import { Perf } from "r3f-perf"

import { Webis } from "./Webis/Webis"

export default function App() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Canvas>
        {/* <Stats /> */}
        <OrbitControls enabled={true} enableZoom={false} />
        <OrthographicCamera zoom={1} makeDefault position={[0, 0, 5000]} far={10000} />
        <directionalLight position={[0, 0, 1]} intensity={4} />
        <directionalLight position={[0, 0, -1]} intensity={4} />
        <Webis />
        {/* <Blob position={[0, 0, -3000]} scale={500} /> */}
      </Canvas>
    </div>
  )
}
