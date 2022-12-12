import { useSpring } from '@react-spring/core';
import { Text3D } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Vector3Tuple } from 'three';

export const Logotype: React.FC<{} & GroupProps> = (props) => {
  const [targetHeight, setTargetHeight] = useState(0.1); 
  const [height, setHeight] = useState(0.1); 
  const spring = useSpring({
    from: { height: 0 },
    height: targetHeight
  });

  useEffect(() => {
    const interval = setInterval(() => {
        setTargetHeight(0.1 + Math.random() * 0.5)
    }, 100)
    return () => {
        clearInterval(interval)
    }
  })

  useFrame(() => {
    setHeight(spring.height.get());
  });

  return (
    <group {...props}>
      <Text3D
        font={'/fonts/stanks-outline.json'}
        rotation={[Math.PI * -0.5, 0, Math.PI * 0.5]}
        position={[-0.5, 0, 0]}
        size={1.38}
        letterSpacing={0.5}
        height={height}
      >
        sTaNKs
        <meshNormalMaterial />
      </Text3D>
    </group>
  );
};
