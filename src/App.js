import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <div className="controls">
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('zoomIn'))}>Zoom In</button>
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('zoomOut'))}>Zoom Out</button>
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('topView'))}>Top</button>
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('bottomView'))}>Bottom</button>
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('leftView'))}>Left</button>
        <button className="control-button" onClick={() => window.dispatchEvent(new CustomEvent('rightView'))}>Right</button>
      </div>

      <Canvas>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} />
        <Sphere scale={1.75} />
        <CameraControls />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
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

  const smoothMove = (start, end, duration, onUpdate) => {
    const startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = Math.sin(t * Math.PI * 0.5);

      const current = start.map((val, index) => val + (end[index] - val) * easedT);
      onUpdate(current);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  useEffect(() => {
    const handleZoomIn = () => {
      camera.zoom = Math.min(camera.zoom * 1.1, 10);
      camera.updateProjectionMatrix();
    };

    const handleZoomOut = () => {
      camera.zoom = Math.max(camera.zoom * 0.9, 0.1);
      camera.updateProjectionMatrix();
    };

    const handleTopView = () => {
      smoothMove([camera.position.x, camera.position.y, camera.position.z], [0, 5, 0], 1000, ([x, y, z]) => {
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      });
    };

    const handleBottomView = () => {
      smoothMove([camera.position.x, camera.position.y, camera.position.z], [0, -5, 0], 1000, ([x, y, z]) => {
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      });
    };

    const handleLeftView = () => {
      smoothMove([camera.position.x, camera.position.y, camera.position.z], [-5, 0, 0], 1000, ([x, y, z]) => {
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      });
    };

    const handleRightView = () => {
      smoothMove([camera.position.x, camera.position.y, camera.position.z], [5, 0, 0], 1000, ([x, y, z]) => {
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      });
    };

    const handleRotate360 = () => {
      const startRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
      const endRotation = [camera.rotation.x, camera.rotation.y + Math.PI * 2, camera.rotation.z];

      smoothMove(startRotation, endRotation, 3000, ([x, y, z]) => {
        camera.rotation.set(x, y, z);
      });
    };

    window.addEventListener('zoomIn', handleZoomIn);
    window.addEventListener('zoomOut', handleZoomOut);
    window.addEventListener('topView', handleTopView);
    window.addEventListener('bottomView', handleBottomView);
    window.addEventListener('leftView', handleLeftView);
    window.addEventListener('rightView', handleRightView);
    window.addEventListener('rotate360', handleRotate360);

    return () => {
      window.removeEventListener('zoomIn', handleZoomIn);
      window.removeEventListener('zoomOut', handleZoomOut);
      window.removeEventListener('topView', handleTopView);
      window.removeEventListener('bottomView', handleBottomView);
      window.removeEventListener('leftView', handleLeftView);
      window.removeEventListener('rightView', handleRightView);
      window.removeEventListener('rotate360', handleRotate360);
    };
  }, [camera]);

  return <OrbitControls enableRotate={true} args={[camera, gl.domElement]} />;
}
