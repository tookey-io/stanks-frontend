import { Vector3Tuple } from 'three';

import { animated, config, useSpring } from '@react-spring/three';
import { GroupProps } from '@react-three/fiber';

export const Point: React.FC<GroupProps> = (props) => {
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[1, 1, 1, 1]} />
        <meshStandardMaterial color={'#fff'} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.9, 0.9, 1, 1]} />
        <meshStandardMaterial color={'#D9D9D9'} />
      </mesh>
    </group>
  );
};

export const FloatingPoint: React.FC<{
  from: Vector3Tuple;
  to: Vector3Tuple;
  onComplete?: () => void;
}> = ({ from, to, onComplete }) => {
  const { scale } = useSpring({
    from: { scale: 0.8 },
    scale: 0,
    config: config.gentle,
  });
  const { position } = useSpring({
    from: {
      position: from,
    },
    position: to,
    config: config.wobbly,
    onResolve: () => (onComplete ? onComplete() : {}),
  });
  return (
    <animated.group
      scale={scale}
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={position}
    >
      <Point />
    </animated.group>
  );
};
