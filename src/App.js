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
      <div className="scrollbar-container">
        <div className="scrollbar-wrapper">
          <label className="scrollbar-label">Horizontal Rotation</label>
          <input
            type="range"
            className="scrollbar horizontal"
            min="0"
            max="360"
            onChange={(e) => window.dispatchEvent(new CustomEvent('rotateHorizontal', { detail: e.target.value }))}
          />
        </div>
        <div className="scrollbar-wrapper">
          <label className="scrollbar-label">Vertical Rotation</label>
          <input
            type="range"
            className="scrollbar vertical"
            min="0"
            max="360"
            onChange={(e) => window.dispatchEvent(new CustomEvent('rotateVertical', { detail: e.target.value }))}
          />
        </div>
        <div className="scrollbar-wrapper">
          <label className="scrollbar-label">Zoom</label>
          <input
            type="range"
            className="scrollbar zoom"
            min="1"
            max="10"
            step="0.1"
            defaultValue="1"
            onChange={(e) => window.dispatchEvent(new CustomEvent('zoom', { detail: parseFloat(e.target.value) }))}
          />
        </div>
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

  const handleRotateHorizontal = useCallback((event) => {
    const value = event.detail;
    const radians = (value / 180) * Math.PI;
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(radians);
      controlsRef.current.update();
    }
  }, []);

  const handleRotateVertical = useCallback((event) => {
    const value = event.detail;
    const radians = (value / 180) * Math.PI;
    if (controlsRef.current) {
      controlsRef.current.setPolarAngle(radians);
      controlsRef.current.update();
    }
  }, []);

  const handleZoom = useCallback((event) => {
    const zoomValue = event.detail;
    camera.zoom = zoomValue;
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    window.addEventListener('rotateHorizontal', handleRotateHorizontal);
    window.addEventListener('rotateVertical', handleRotateVertical);
    window.addEventListener('zoom', handleZoom);

    return () => {
      window.removeEventListener('rotateHorizontal', handleRotateHorizontal);
      window.removeEventListener('rotateVertical', handleRotateVertical);
      window.removeEventListener('zoom', handleZoom);
    };
  }, [handleRotateHorizontal, handleRotateVertical, handleZoom]);

  return <OrbitControls ref={controlsRef} enableRotate={true} enableZoom={true} args={[camera, gl.domElement]} />;
}
