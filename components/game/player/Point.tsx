import { useSpring } from "@react-spring/three";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Color, LayerMaterial } from "lamina";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";

export const Point: React.FC<GroupProps> = (props) => {
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[1, 1, 1, 1]} />
        <meshStandardMaterial color={"#fff"} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.9, 0.9, 1, 1]} />
        <meshStandardMaterial color={"#D9D9D9"} />
      </mesh>
    </group>
  );
};
