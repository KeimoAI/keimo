'use client';

import { useState } from 'react';
import Ellipsis from './Ellipsis';
import TextScroller, { ScrollEdge } from './TextScroller';

export type BgColor = 'white' | 'green';

const OverflowIndicator = ({
  className,
  bgColor,
}: {
  className?: string;
  bgColor: string;
}) => (
  <div className={`flex flex-col ${className}`}>
    <div
      className={`flex-initial flex flex-col items-center shrink w-full bg-${bgColor}`}
    >
      <Ellipsis className="flex-initial shrink" />
    </div>
    <div className="flex-initial h-2 bg-gradient-to-b from-${bgColor}" />
  </div>
);

const Pointy = ({
  pointTarget,
  pointWidth,
  pointOffset,
  borderWidth,
  bgColor,
}: {
  pointTarget: { x: number; y: number };
  pointWidth: number;
  pointOffset: { right: number } | { left: number };
  borderWidth: number;
  bgColor: BgColor;
}) => {
  const dims = {
    w: Math.abs(pointTarget.x) + borderWidth,
    h: Math.abs(pointTarget.y) + borderWidth,
  };

  // Shift all x coords by this amount to make them positive
  const negativeXAdjust = -Math.min(0, pointTarget.x);
  dims.w += negativeXAdjust;

  const fill = {
    white: 'fill-white',
    green: 'fill-green',
  }[bgColor];

  // base css `right` distance
  const rightBasis = borderWidth - Math.max(pointTarget.x - pointWidth, 0);
  return (
    <svg
      version="1.1"
      width={`${dims.w}`}
      height={`${dims.h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${fill} stroke-black`}
      style={{
        top: '100%',
        ...('right' in pointOffset
          ? {
              right: `calc(${rightBasis}px + ${pointOffset.right}rem - ${negativeXAdjust}px)`,
            }
          : {
              left: `calc(${pointOffset.left}rem - ${negativeXAdjust}px)`,
            }),
      }}
    >
      <polyline
        points={`${negativeXAdjust}, 0 ${pointTarget.x + negativeXAdjust}, ${
          pointTarget.y
        } ${negativeXAdjust + pointWidth}, 0`}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={borderWidth}
      />
    </svg>
  );
};

const DimmedStack = ({ bgColor }: { bgColor: BgColor }) => {
  const bg = {
    white: 'bg-white',
    green: 'bg-green',
  }[bgColor];
  return (
    <>
      <div
        className={`flex items-stretch flex-none -mb-5 h-8 p-0 paper ${bg} z-0`}
      >
        <div className={`bg-black flex-1 opacity-50`} />
      </div>
      <div
        className={`flex items-stretch flex-none -mb-5 h-8 p-0 paper ${bg} z-0`}
      >
        <div className={`bg-black flex-1 opacity-30`} />
      </div>
    </>
  );
};

export type Props = {
  text: string;
  resetTick: number;
  className?: string;
  bubbleClassName?: string;
  bgColor?: BgColor;
  point?: {
    target: { x: number; y: number };
    offset: { left: number } | { right: number };
    width: number;
  };
};

const SpeechBubble = ({
  text,
  resetTick,
  className,
  bubbleClassName,
  bgColor,
  point,
}: Props) => {
  bgColor = bgColor ?? 'white';
  const bg = {
    white: 'bg-white',
    green: 'bg-green',
  }[bgColor];

  // TODO?: somehow extract borderWidth from paper class border width in pixels
  const borderWidth = 4; // tailwind border-4 == 4px

  const [isOverflow, setIsOverflow] = useState(false);
  const [scrollEdge, setScrollEdge] = useState<ScrollEdge>();

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <DimmedStack bgColor={bgColor} />

      <div
        className={`flex flex-col min-h-0 items-center relative paper ${bg} z-20 ${bubbleClassName}`}
      >
        {isOverflow && scrollEdge !== 'top' && (
          <OverflowIndicator
            bgColor={bgColor}
            className={`absolute top-1 right-1 left-1`}
          />
        )}
        <TextScroller
          onOverflow={setIsOverflow}
          onScrollEdge={setScrollEdge}
          text={text}
          className="min-h-[1rem] p-1 flex-1 w-full overflow-y-auto"
        />
        <Pointy
          borderWidth={borderWidth}
          pointOffset={point?.offset ?? { left: 1 }}
          pointWidth={point?.width ?? 40}
          pointTarget={point?.target ?? { x: 80, y: 40 }}
          bgColor={bgColor}
        />
      </div>
    </div>
  );
};

export default SpeechBubble;
