import React, { useEffect, useMemo, useState } from 'react';
import { Vector3Tuple } from 'three';

import { config, useSpring } from '@react-spring/three';
import { Line } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';

export const Tracing: React.FC<
  {
    from: Vector3Tuple;
    to: Vector3Tuple;
    power: number;
    onComplete?: () => void;
  } & GroupProps
> = React.memo(
  function Tracing(props) {
    const points = useMemo(() => [props.from, props.to], [props]);
    const [targetWidth, setTargetWidth] = useState(0);
    const [width, setWidth] = useState(0);
    const { value } = useSpring({
      from: { value: 0 },
      value: targetWidth,
      config: config.stiff,
    });

    useFrame(() => setWidth(value.get()));

    useEffect(() => {
      const intervals: NodeJS.Timeout[] = [];

      intervals.push(setTimeout(() => setTargetWidth(0), 0));
      intervals.push(setTimeout(() => setTargetWidth(props.power * 0.1), 10));
      intervals.push(setTimeout(() => setTargetWidth(0), 120));
      intervals.push(setTimeout(() => props.onComplete?.(), 300));

      return () => intervals.forEach((i) => clearTimeout(i));
    }, [setTargetWidth, props]);

    return (
      <Line worldUnits points={points} lineWidth={width} color="red">
        {/* <lineDashedMaterial depthWrite={false} depthFunc={NeverDepth} color="#ff0000"></lineDashedMaterial> */}
      </Line>
    );
  },
  (prev, next) => {
    return JSON.stringify(prev) === JSON.stringify(next);
  },
);
