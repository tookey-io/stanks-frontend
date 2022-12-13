import { animated, useSpring } from "@react-spring/three";
import { GroupProps } from "@react-three/fiber";
import { Color, LayerMaterial } from "lamina";
import { useState } from "react";

export const Tile: React.FC<{ x: number; y: number } & GroupProps> = (
  props
) => {
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const { color } = useSpring({
    color: hovered ? "#00ff00" : "#333333"
  })

  return (
    <group
      {...props}
      scale={0.9}
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={[props.x, 0, props.y]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh>
        <planeGeometry args={[1, 1, 1, 1]} />
        {/* @ts-ignore */}
        <animated.meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.9, 0.9, 1, 1]} />
        <meshStandardMaterial color={"#000"} />
      </mesh>
    </group>
  );
};
