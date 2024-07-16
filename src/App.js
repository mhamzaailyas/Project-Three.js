import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
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
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotate', { detail: 'up' }))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotate'))}>Rotate Up</button>
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotate', { detail: 'down' }))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotate'))}>Rotate Down</button>
        <button className="rotate-button" onMouseDown={() => window.dispatchEvent(new CustomEvent('startRotate360'))} onMouseUp={() => window.dispatchEvent(new CustomEvent('stopRotate360'))}>Rotate 360</button>
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
  const [isRotating, setIsRotating] = useState(false);
  const [direction, setDirection] = useState(null);
  const frameId = useRef(null);

  const rotate = () => {
    const rotationSpeed = 0.02; // Adjust the speed as needed
    const target = controlsRef.current.target.clone(); // OrbitControls target

    if (direction === 'left') {
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
    } else if (direction === 'right') {
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed);
    } else if (direction === 'up') {
      const axis = new THREE.Vector3().subVectors(camera.position, target).cross(camera.up).normalize();
      const newPos = camera.position.clone().applyAxisAngle(axis, rotationSpeed);
      if (newPos.y < 10 && newPos.y > -10) { // Adjust limits as needed
        camera.position.copy(newPos);
      } else {
        stopRotate();
      }
    } else if (direction === 'down') {
      const axis = new THREE.Vector3().subVectors(camera.position, target).cross(camera.up).normalize();
      const newPos = camera.position.clone().applyAxisAngle(axis, -rotationSpeed);
      if (newPos.y < 10 && newPos.y > -10) { // Adjust limits as needed
        camera.position.copy(newPos);
      } else {
        stopRotate();
      }
    }

    camera.lookAt(target);
    controlsRef.current.update();
  };

  const startRotate = useCallback((event) => {
    setDirection(event.detail);
    setIsRotating(true);
  }, []);

  const stopRotate = useCallback(() => {
    setIsRotating(false);
    setDirection(null);
  }, []);

  const handleRotate360 = useCallback(() => {
    const rotationSpeed = 0.02; // Adjust the speed as needed
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
    controlsRef.current.update();
    frameId.current = requestAnimationFrame(handleRotate360);
  }, [camera]);

  const stopRotate360 = useCallback(() => {
    cancelAnimationFrame(frameId.current);
    frameId.current = null;
  }, []);

  useEffect(() => {
    if (isRotating) {
      const rotateFn = () => {
        rotate();
        frameId.current = requestAnimationFrame(rotateFn);
      };
      frameId.current = requestAnimationFrame(rotateFn);
    } else {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
  }, [isRotating, direction]);

  useEffect(() => {
    window.addEventListener('startRotate', startRotate);
    window.addEventListener('stopRotate', stopRotate);
    window.addEventListener('startRotate360', handleRotate360);
    window.addEventListener('stopRotate360', stopRotate360);

    return () => {
      window.removeEventListener('startRotate', startRotate);
      window.removeEventListener('stopRotate', stopRotate);
      window.removeEventListener('startRotate360', handleRotate360);
      window.removeEventListener('stopRotate360', stopRotate360);
    };
  }, [startRotate, stopRotate, handleRotate360, stopRotate360]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={true}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      onPointerDown={() => {
        setIsRotating(false);
      }}
      args={[camera, gl.domElement]}
    />
  );
}
