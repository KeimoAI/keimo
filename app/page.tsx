'use client';
import Keimo from 'components/Keimo';
import SpeakButton from 'components/SpeakButton';
import SpeechBubble from 'components/SpeechBubble';
import Image from 'next/image';
import useKeimoStateStore from 'store/keimoStateStore';
import { shallow } from 'zustand/shallow';
import styles from './page.module.css';

export default function Home() {
  const [userMsg, keimoMsg] = useKeimoStateStore(
    (store) => [store.dialog.current.userMsg, store.dialog.current.keimoMsg],
    shallow
  );

  return (
    <main className={`${styles.main} relative h-full flex min-w-0 content-end`}>
      <div
        className={`${styles.bg} w-full h-full absolute -z-50 overflow-hidden`}
      />
      <Keimo className="self-end" width={600} />
      <div className="w-full flex-1 flex flex-col justify-end pb-6 pr-6">
        <SpeechBubble
          className="w-96 mb-4"
          point={{
            offset: { left: 1 },
            width: 50,
            target: { x: -40, y: 40 },
          }}
          text={
            // TODO: have special bubble state for empty msg
            keimoMsg ?? ''
          }
          resetTick={0}
        />
        <SpeechBubble
          className="mr-[5rem] w-80 mb-14 self-end"
          point={{
            offset: { right: 1 },
            width: 50,
            target: { x: 80, y: 40 },
          }}
          bgColor="green"
          text={userMsg ?? ''}
          resetTick={0}
        />
        <SpeakButton className="self-end" />
      </div>
    </main>
  );
}
