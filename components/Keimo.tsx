'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import useKeimoStateStore, { State } from 'store/keimoStateStore';

import idleAnimation from 'public/animations/keimo-idle.json';
import keimoMouthAnimation from 'public/animations/keimo-mouth.json';
import listeningAnimation from 'public/animations/keimo-listening.json';
import thinkingAnimation from 'public/animations/keimo-thinking.json';
// import speakingAnimation from 'public/animations/keimo-speaking.json';

export default function Keimo({
  width = 300,
  className,
}: {
  width?: number;
  className?: string;
}) {
  const state = useKeimoStateStore((store) => store.state);

  return (
    <div
      className={`${className} relative`}
      style={{
        width,
        height: width,
        marginTop: -width / 2,
        marginLeft: `-${(80 * width) / 600}px`,
        marginRight: `-${(140 * width) / 600}px`,
        overflowY: 'hidden',
      }}
    >
      <Player
        className={`absolute z-0 bottom-0`}
        autoplay
        loop
        src={idleAnimation}
        style={{
          display:
            state === State.IDLE || state === State.SPEAKING ? 'block' : 'none',
        }}
      />
      <Player
        className={`absolute z-10 bottom-0`}
        autoplay
        loop
        src={keimoMouthAnimation}
        style={{
          display: state === State.SPEAKING ? 'block' : 'none',
        }}
      />
      <Player
        className={`absolute z-10 bottom-0`}
        autoplay
        loop
        src={listeningAnimation}
        style={{
          display: state === State.LISTENING ? 'block' : 'none',
        }}
      />
      <Player
        className={`absolute z-10 bottom-0`}
        autoplay
        loop
        src={thinkingAnimation}
        style={{
          display: state === State.THINKING ? 'block' : 'none',
        }}
      />
    </div>
  );
}
