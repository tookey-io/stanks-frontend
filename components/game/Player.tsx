import { Html } from '@react-three/drei';
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

const Info: React.FC<Omit<PlayerData, "position"> & HtmlProps> = (props) => {
  return (
    <Html {...props} style={{ position: 'relative' }}>
      <div className="flex justify-center rounded-full bg-white w-0 mb-1">
        {new Array(props.hearts).fill(0).map((_, index) => (
          <div
            key={index}
            className="rounded-full w-1 h-1 bg-red m-[1px] flex-none"
          ></div>
        ))}
      </div>
      <div className="group flex items-center bg-white rounded-full relative left-[-1rem]">
        <img src={props.userpic} className="w-8 h-8 rounded-full" />
        <div className="transition-all mx-0 max-w-0 text-black group-hover:mx-2 group-hover:max-w-[100px] truncate">
          {props.name}
        </div>
      </div>
    </Html>
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
      <Info {...props} position={[0, 0, 0.55 + props.points * 0.15]} />
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
