import React from "react";
import { Easing } from "remotion";

const makePoints: (options: {
  numberOfPoints: number;
  amplitude: number;
  offsetPixels: number;
  width: number;
}) => Array<{ x: number; y: number }> = ({
  numberOfPoints,
  amplitude,
  offsetPixels,
  width
}) => {
  const step = 1 / numberOfPoints;
  const stepOffset = offsetPixels / width;

  return Array.from({ length: numberOfPoints })
    .map((_, i, arr) => {
      const fraction = ((i + 0.5) % arr.length) * step - stepOffset;

      let x = (fraction + 1) % 1;
      x = x * width;

      let y = Math.sin(fraction * Math.PI);
      // shape the wave
      y = Easing.cubic(y);
      // amplify the wave
      y = y * amplitude;
      // every other point above/below center
      y = y * Math.sin((0.5 + i) * Math.PI);

      return { x: Math.round(x), y: Math.round(y) };
    })
    .sort((a, b) => (a.x > b.x ? 1 : -1));
};

export const Wave: React.FC<{
  // how many sections the wave has
  sections: number;
  // move the wave left or right
  offsetPixels: number;
  // big amplitude = big waveform
  amplitude: number;
  // width of bounds
  width: number;
  // height of bounds
  height: number;
  // number of wave lines
  lines: number;
  // width of gap between lines
  lineGap?: number;
  // string: any CSS-like color string
  // string[]: array of CSS-like color strings
  // colors will repeat if there are more lines than colors
  lineColor: string | string[];
  // thickness of the lines
  lineThickness?: number;
  // roundness of wave peaks
  // 0-1 (default: 0.4)
  topRoundness?: number;
  // roundness of wave valleys
  // 0-1 (default: 0.4)
  bottomRoundness?: number;
}> = ({
  sections,
  offsetPixels,
  amplitude,
  width,
  height,
  lines,
  lineGap = 20,
  lineColor = "blue",
  lineThickness = 2,
  topRoundness = 0.4,
  bottomRoundness = 0.4
}) => {
  const w = width;
  const h = height;
  const nPoints = sections;
  const off = offsetPixels % ((2 * width) / sections);

  const linePoints = Array.from({ length: lines }).map((_, i) => {
    const lineShift = i * lineGap;
    return makePoints({
      width: w,
      numberOfPoints: nPoints,
      offsetPixels: lineShift + off,
      amplitude
    });
  });

  const sectionWidth = w / nPoints;
  const topControlPointDistance = topRoundness * sectionWidth;
  const bottomControlPointDistance = bottomRoundness * sectionWidth;

  return (
    <div style={{ width, height }}>
      <svg width={w} height={h} viewBox={`0 -${0.5 * h} ${w} ${h}`}>
        {linePoints.map((line, lineIndex) => {
          // repeat colors if there are too few
          const color = Array.isArray(lineColor)
            ? lineColor[lineIndex % lineColor.length]
            : lineColor;

          return (
            <path
              key={`line-${lineIndex}`}
              d={`M 0 0, ${line
                .map((p, i, pts) => {
                  const prevP = i === 0 ? { x: 0, y: 0 } : pts[i - 1];

                  const isBottomPoint = p.y < 0;

                  const currPointControlDistance = isBottomPoint
                    ? topControlPointDistance
                    : bottomControlPointDistance;
                  const prevPointControlDistance = isBottomPoint
                    ? bottomControlPointDistance
                    : topControlPointDistance;

                  const cp1x = prevP.x + prevPointControlDistance;
                  const cp1y = prevP.y;
                  const cp2x = p.x - currPointControlDistance;
                  const cp2y = p.y;
                  const px = p.x;
                  const py = p.y;
                  return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${px} ${py}`;
                })
                .join(",")}, L ${w} 0`}
              stroke={color}
              strokeWidth={lineThickness}
              fill="none"
            />
          );
        })}
      </svg>
    </div>
  );
};
