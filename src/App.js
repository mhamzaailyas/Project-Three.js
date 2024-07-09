import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function App() {
  const controls = useRef()

  return (
    <Canvas>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />
      <Sphere scale={1.75} />
      <OrbitControls ref={controls} enableRotate={true} />
      <Environment preset="sunset" />
    </Canvas>
  )
}

function Sphere(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="white" metalness={0.3} roughness={0.1} />
    </mesh>
  )
}
