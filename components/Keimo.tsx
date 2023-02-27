'use client';

import { Player } from '@lottiefiles/react-lottie-player';

export default function Keimo() {
  return (
    <div className="w-[300px] h-[300px]">
      <Player
        autoplay
        loop
        src="/animations/keimo-idle.json"
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
}
