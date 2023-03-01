import SpeakButton from 'components/SpeakButton';
import SpeechBubble from 'components/SpeechBubble';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={`${styles.main} bg-blue h-full flex flex-col min-w-0 p-4`}>
      <div className="w-full flex-1 flex flex-col justify-end">
        <SpeechBubble
          className="w-96 mb-4"
          point={{
            offset: { left: 1 },
            width: 50,
            target: { x: -40, y: 40 },
          }}
          text={'test'}
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
          text={'test'}
          resetTick={0}
        />
      </div>
      <SpeakButton className="self-end" />
    </main>
  );
}
