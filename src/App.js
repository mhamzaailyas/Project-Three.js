import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5 * Math.PI} />
      <Sphere scale={1.75} />
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}

function Sphere(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  )
}
