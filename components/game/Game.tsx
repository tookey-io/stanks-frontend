import { Html, MapControls, OrbitControls, Text3D } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import { GameState } from '../../models/game';
import GameStore from '../../stores/game.store';
import { Logotype } from './Logo';
import { Player } from './Player';
import { FloatingPoint } from './player/Point';
import { Tile } from './Tile';
import { Tracing } from './Tracing';

const Log: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <Html
      position={[-0.4, 0, -0.6]}
      rotation={[Math.PI * -0.5, 0, 0]}
      transform
      prepend
      zIndexRange={[-1, 0]}
      className="flex flex-col justify-end"
      style={{
        fontFamily: 'monospace',
        color: '#333333',
        width: '0px',
        whiteSpace: 'nowrap',
        height: '0px',
      }}
    >
      <ul className="">
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </Html>
  );
};

export const Game: React.FC<GameStore> = (props) => {
  const grid: Array<[number, number]> = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 20; x++) {
      grid.push([x, y]);
    }
  }

  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      camera={{
        position: [300, 450, 300],
        near: -1000,
        far: 1000,
        zoom: 50,
      }}
    >
      <Suspense>
        <ambientLight intensity={1} />
        <group position={[-7, 0, 0]}>
          <Log lines={props.log} />
          {grid.map(([x, y]) => (
            <Tile x={x} y={y} key={`${x}-${y}`} />
          ))}

          <gridHelper
            args={[1000, 1000, '#333', '#222']}
            position={[-0.5, 0, -0.5]}
          />

          <Logotype position={[-0.5, 0, 9.5]} />

          {props.tracings.map((trace, index) => (
            <Tracing
              key={trace.uuid}
              from={[trace.from.x, 0.15, trace.from.y]}
              to={[trace.to.x, 0.15, trace.to.y]}
              power={trace.power}
              onComplete={() =>
                props.tracings.splice(
                  props.tracings.findIndex((t) => t.uuid === trace.uuid),
                )
              }
            />
          ))}

          {props.floatingPoints.map((point, index) => (
            <FloatingPoint
              key={index}
              from={[
                point.from.at.x,
                0.55 + point.from.height * 0.15,
                point.from.at.y,
              ]}
              onComplete={() => props.floatingPoints.splice(index)}
              to={[point.to.at.x, 0.55 + point.to.height * 0.15, point.to.at.y]}
            />
          ))}

          {Object.values(props.players).map((player, index) => (
            <Player {...player} key={player.name + index} />
          ))}

          <Html
            transform
            prepend
            zIndexRange={[-1, 0]}
            // className="w-0 h-0"
            distanceFactor={15}
            rotation={[Math.PI * -0.5, 0, 0]}
            position={[-0.5, 0, 10.38]}
            className="flex flex-col justify-start"
            style={{
              fontFamily: 'monospace',
              color: '#333333',
              width: '0px',
              whiteSpace: 'nowrap',
              height: '0px',
            }}
          >
            <Image
              src={'/images/secure.png'}
              alt={'secured by'}
              width={320}
              height={53}
              className="w-[320px] h-[53px] block max-w-none"
            />
          </Html>
        </group>
        <MapControls />
        {/* <OrbitControls /> */}
      </Suspense>
    </Canvas>
  );
};
