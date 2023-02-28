'use client';

import { useState } from 'react';
import Ellipsis from './Ellipsis';
import TextScroller, { ScrollEdge } from './TextScroller';

const OverflowIndicator = ({ className }: { className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <div className="flex-initial flex flex-col items-center shrink w-full bg-white">
      <Ellipsis className="flex-initial shrink" />
    </div>
    <div className="flex-initial h-2 bg-gradient-to-b from-white" />
  </div>
);

const Pointy = ({
  pointTarget,
  pointWidth,
  pointOffset,
  borderWidth,
}: {
  pointTarget: { x: number; y: number };
  pointWidth: number;
  pointOffset: number;
  borderWidth: number;
}) => {
  const dims = {
    w: Math.abs(pointTarget.x + borderWidth / 2),
    h: Math.abs(pointTarget.y + borderWidth / 2),
  };

  // base css `right` distance
  const rightBasis = borderWidth - Math.max(pointTarget.x - pointWidth, 0);
  return (
    <svg
      version="1.1"
      width={`${dims.w}`}
      height={`${dims.h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute fill-white stroke-black`}
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

export type Props = {
  text: string;
  resetTick: number;
  className?: string;
  bubbleClassName?: string;
};

const SpeechBubble = ({
  text,
  resetTick,
  className,
  bubbleClassName,
}: Props) => {
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
    <div className={`flex flex-col items-center relative paper ${className}`}>
      {isOverflow && scrollEdge !== 'top' && (
        <OverflowIndicator className={`absolute top-1 right-1 left-1`} />
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
      />
    </div>
  );
};

export default SpeechBubble;
