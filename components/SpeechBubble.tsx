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
  pointOffset: number;
  borderWidth: number;
  bgColor: BgColor;
}) => {
  const dims = {
    w: Math.abs(pointTarget.x + borderWidth / 2),
    h: Math.abs(pointTarget.y + borderWidth / 2),
  };

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
        right: `calc(${rightBasis}px + ${pointOffset}rem)`,
      }}
    >
      <polyline
        points={`0, 0 ${pointTarget.x}, ${pointTarget.y} ${pointWidth}, 0`}
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
};

const SpeechBubble = ({
  text,
  resetTick,
  className,
  bubbleClassName,
  bgColor,
}: Props) => {
  bgColor = bgColor ?? 'white';
  const bg = {
    white: 'bg-white',
    green: 'bg-green',
  }[bgColor];

  // TODO?: somehow extract borderWidth from paper class border width in pixels
  const borderWidth = 4; // tailwind border-4 == 4px

  const pointOffset = 1;
  const pointWidth = 40;
  const pointTarget = {
    x: 80,
    y: 40,
  };

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
          className="flex-1 w-full overflow-y-auto"
        />
        <Pointy
          borderWidth={borderWidth}
          pointOffset={pointOffset}
          pointWidth={pointWidth}
          pointTarget={pointTarget}
          bgColor={bgColor}
        />
      </div>
    </div>
  );
};

export default SpeechBubble;
