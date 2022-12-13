import { Html, useTexture } from '@react-three/drei';
import { HtmlProps } from '@react-three/drei/web/Html';
import { GroupProps } from '@react-three/fiber';
import {
  Color,
  DebugLayerMaterial,
  Depth,
  Fresnel,
  LayerMaterial,
} from 'lamina';
import { PlayerData } from '../../models/game';
import { Point } from './player/Point';
import { useSpring, animated, config } from '@react-spring/three';

const Userpic: React.FC<Omit<PlayerData, "position"> & HtmlProps> = (props) => {
  const userPic = useTexture({
    map: props.userpic
  })

  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[1, 1, 1, 1]} />
        <meshLambertMaterial {...userPic} /> 
      </mesh>
    </group>
  );
};

const Hearts: React.FC<Omit<PlayerData, "position"> & HtmlProps> = (props) => {
  return (
    <group {...props}>
      <Html transform prepend style={{ position: 'relative' }}>
        <div className="flex justify-center rounded-full bg-white gap-[1px] p-[1px] mt-2">
          {new Array(props.hearts).fill(0).map((_, index) => (
            <div
              key={index}
              className="rounded-full w-1 h-1 bg-red flex-none"
            ></div>
          ))}
        </div>
      </Html>
    </group>
  );
};
const Range: React.FC<Omit<PlayerData, "position"> & HtmlProps> = (props) => {
  return (
    <group {...props}>
      <Html transform prepend style={{ position: 'relative' }}>
        <div className="flex justify-center bg-black gap-[2px] p-[1px] mb-2">
          {new Array(props.range).fill(0).map((_, index) => (
            <div
              key={index}
              className="w-1 h-1 bg-white flex-none"
            ></div>
          ))}
        </div>
      </Html>
    </group>
  );
};

export const Player: React.FC<PlayerData & Omit<GroupProps, 'position'>> = (
  props,
) => {
  const { position } = useSpring({
    position: [props.position.x, 0.15, props.position.y] as const,
    config: config.gentle,
  });
  return (
    <animated.group
      {...props}
      position={position}
      rotation={[-Math.PI * 0.5, 0, 0]}
    >
      <Userpic {...props} position={[0, 0, props.points * 0.15]} scale={0.8}/>
      <Hearts {...props} position={[0, 0.5, props.points * 0.15]} />
      <Range {...props} position={[0, -0.5, props.points * 0.15]} />
      {props.points > 0 &&
        new Array(props.points)
          .fill(0)
          .map((_, index) => (
            <Point
              scale={0.8}
              position={[0, 0, index * 0.15]}
              key={`points-${index}`}
            />
          ))}
    </animated.group>
  );
};
