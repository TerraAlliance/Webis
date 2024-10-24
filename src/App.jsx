import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls } from "@react-three/drei"
// import { Stats } from "@react-three/drei"

export default function App({ children }) {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Canvas>
        <OrthographicCamera zoom={1} makeDefault position={[0, 0, 5000]} far={10000} />
        <OrbitControls enabled={false} enableZoom={false} />
        {/* <Stats /> */}
        {children}
      </Canvas>
    </div>
  )
}
