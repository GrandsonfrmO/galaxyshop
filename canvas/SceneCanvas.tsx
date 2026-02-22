
import React, { Suspense, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, AdaptiveDpr } from '@react-three/drei';
import { TheOrbit } from './TheOrbit';
import { TheBoutique } from './TheBoutique';
import { CameraRig } from './CameraRig';
import { useStore } from '../store/useStore';

export const SceneCanvas: React.FC = () => {
  const sceneState = useStore((state) => state.scene);

  // Memoize scene components to prevent unnecessary re-renders
  const sceneComponent = useMemo(() => {
    if (sceneState === 'ORBIT' || sceneState === 'TRANSITIONING') {
      return <TheOrbit />;
    } else if (sceneState === 'BOUTIQUE') {
      return <TheBoutique />;
    }
    return null;
  }, [sceneState]);

  // Callback for canvas creation to optimize rendering
  const onCreated = useCallback(({ gl }) => {
    // Enable antialiasing for smoother visuals
    gl.antialias = true;
    // Set pixel ratio for better performance
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, []);

  // If in GAME mode, we unmount the 3D scene entirely to give full resources to the 2D Canvas game
  if (sceneState === 'GAME') return null;

  return (
    <div className="w-full h-screen bg-black">
      <Canvas 
        shadows 
        camera={{ position: [0, 2, 15], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5, max: 1 }}
        onCreated={onCreated}
        gl={{ 
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
        }}
      >
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <CameraRig />
          {sceneComponent}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: 'black' }}
        innerStyles={{ width: '50vw' }}
        barStyles={{ height: '5px', background: 'white' }}
        dataStyles={{ fontSize: '12px', color: 'white' }}
      />
    </div>
  );
};
