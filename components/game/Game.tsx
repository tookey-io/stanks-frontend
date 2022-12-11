import { MapControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Vector3 } from "three";
import { GameState } from "../../models/game";
import { Player } from "./Player";
import { Tile } from "./Tile";

export const Game: React.FC<GameState> = (props) => {
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
          {grid.map(([x, y]) => (
            <Tile x={x} y={y} key={`${x}-${y}`} />
          ))}

          {Object.values(props.players).map((player, index) => (
            <Player
              {...player}
              key={player.name + index}
            />
          ))}
        </group>
        {/* <MapControls /> */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};
