import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <Canvas>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} />
        <Sphere scale={1.75} />
        <CameraControls />
        <Environment preset="sunset" />
      </Canvas>
      <div className="button-container">
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotate', { detail: 'left' }))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotate'))}>Rotate Left</button>
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotate', { detail: 'right' }))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotate'))}>Rotate Right</button>
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotateMouse'))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotateMouse'))}>Mouse Rotate</button>
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotateUp'))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotateUp'))}>Mouse Up</button>
      </div>
    </div>
  );
}

function Sphere(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="white" metalness={0.3} roughness={0.1} />
    </mesh>
  );
}

function CameraControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  const handleStartRotate = useCallback((event) => {
    const direction = event.detail;
    const rotate = () => {
      const rotationSpeed = 0.005;
      if (direction === 'left') {
        camera.position.x = camera.position.x * Math.cos(rotationSpeed) + camera.position.z * Math.sin(rotationSpeed);
        camera.position.z = camera.position.z * Math.cos(rotationSpeed) - camera.position.x * Math.sin(rotationSpeed);
      } else if (direction === 'right') {
        camera.position.x = camera.position.x * Math.cos(-rotationSpeed) + camera.position.z * Math.sin(-rotationSpeed);
        camera.position.z = camera.position.z * Math.cos(-rotationSpeed) - camera.position.x * Math.sin(-rotationSpeed);
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }, []);

  const handleStopRotate = useCallback(() => {
    controlsRef.current.dispatchEvent({ type: 'end' });
  }, []);

  // Placeholder functions to resolve ESLint errors
  const handleStartRotateMouse = useCallback(() => { }, []);
  const handleStopRotateMouse = useCallback(() => { }, []);
  const handleStartRotateUp = useCallback(() => { }, []);
  const handleStopRotateUp = useCallback(() => { }, []);

  useEffect(() => {
    window.addEventListener('startRotate', handleStartRotate);
    window.addEventListener('stopRotate', handleStopRotate);
    window.addEventListener('startRotateMouse', handleStartRotateMouse);
    window.addEventListener('stopRotateMouse', handleStopRotateMouse);
    window.addEventListener('startRotateUp', handleStartRotateUp);
    window.addEventListener('stopRotateUp', handleStopRotateUp);

    return () => {
      window.removeEventListener('startRotate', handleStartRotate);
      window.removeEventListener('stopRotate', handleStopRotate);
      window.removeEventListener('startRotateMouse', handleStartRotateMouse);
      window.removeEventListener('stopRotateMouse', handleStopRotateMouse);
      window.removeEventListener('startRotateUp', handleStartRotateUp);
      window.removeEventListener('stopRotateUp', handleStopRotateUp);
    };
  }, [handleStartRotate, handleStopRotate, handleStartRotateMouse, handleStopRotateMouse, handleStartRotateUp, handleStopRotateUp]);

  return <OrbitControls ref={controlsRef} enableRotate={true} enableZoom={true} args={[camera, gl.domElement]} />;
}