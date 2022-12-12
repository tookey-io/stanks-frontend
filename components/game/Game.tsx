import { Html, MapControls, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import { GameState } from '../../models/game';
import GameStore from '../../stores/game.store';
import { Player } from './Player';
import { FloatingPoint } from './player/Point';
import { Tile } from './Tile';

const Log: React.FC<{ lines: string[] }> = ({ lines }) => {
  return (
    <Html position={[-0.4, 0, -0.6]} rotation={[Math.PI * -0.5, 0, 0]} transform prepend zIndexRange={[-1, 0]} className="flex flex-col justify-end" style={{ fontFamily: "monospace", color: "#333333", width: '0px', whiteSpace: 'nowrap', height: '0px'}}>
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
        zoom: 1.5 * 100,
      }}
    >
      <Suspense>
        <ambientLight intensity={1} />
        <group position={[-7, 0, 0]}>
          <Log lines={props.log}/>
          {grid.map(([x, y]) => (
            <Tile x={x} y={y} key={`${x}-${y}`} />
          ))}

          {props.floatingPoints.map((point, index) => (
            <FloatingPoint
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
        </group>
        {/* <MapControls /> */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};
