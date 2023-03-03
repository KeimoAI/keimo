'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import useKeimoStateStore, { State } from 'store/keimoStateStore';

import idleAnimation from 'public/animations/keimo-idle.json';
import keimoMouthAnimation from 'public/animations/keimo-mouth.json';
// import listeningAnimation from 'public/animations/keimo-listening.json';
// import thinkingAnimation from 'public/animations/keimo-thinking.json';
// import speakingAnimation from 'public/animations/keimo-speaking.json';

export default function Keimo({
  width = 300,
  className,
}: {
  width?: number;
  className?: string;
}) {
  const state = useKeimoStateStore((store) => store.state);
  const [animation, setAnimation] = useState(idleAnimation);
  const keimoRef = useRef(null);
  const keimoMouthRef = useRef(null);

  useEffect(() => {
    if (!keimoRef.current) return;

    switch (state) {
      case State.IDLE:
        setAnimation(idleAnimation);
        break;

      case State.LISTENING:
        break;

      case State.THINKING:
        // setAnimation(thinkingAnimation);
        break;

      case State.SPEAKING:
        // setAnimation(speakingAnimation);
        break;
    }
  }, [state]);

  return (
    <div className={className}>
      <Player
        className={`relative`}
        ref={keimoRef}
        autoplay
        loop
        src={animation}
        style={{
          width,
          marginTop: -width / 2,
          marginLeft: `-${(80 * width) / 600}px`,
          marginRight: `-${(140 * width) / 600}px`,
          overflowY: 'hidden',
        }}
      >
        <Player
          className={`absolute z-10 bottom-0 invisible ${
            state === State.SPEAKING && 'visible'
          }}`}
          ref={keimoMouthRef}
          autoplay
          loop
          src={keimoMouthAnimation}
          style={{
            width,
            marginTop: -width / 2,
            marginLeft: `-${(80 * width) / 600}px`,
            marginRight: `-${(140 * width) / 600}px`,
            overflowY: 'hidden',
          }}
        />
      </Player>
    </div>
  );
}
