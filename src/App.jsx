import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls, Stats } from "@react-three/drei"

import { Blob } from "./Blob"
import { Webis } from "./Webis/Webis"

export default function App() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", background: "black" }}>
      <Canvas>
        <Stats />
        <OrbitControls enabled={true} />
        <OrthographicCamera makeDefault position={[0, 0, 5000]} far={10000} />
        <pointLight position={[0, 5000, 10000]} intensity={5} decay={0} />
        <directionalLight position={[0, 0, 1]} intensity={1} />
        <directionalLight position={[0, 0, -1]} intensity={1} />
        <Webis />
        <Blob position={[0, 0, -3000]} scale={500} />
      </Canvas>
    </div>
  )
}
