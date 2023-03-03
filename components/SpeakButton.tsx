'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { shallow } from 'zustand/shallow';

import useKeimoStateStore, { State } from 'store/keimoStateStore';
import useAudioRecorder from 'lib/AudioRecorder';

export type Props = { className?: string };

export default function SpeakButton({ className }: Props) {
  const recorder = useAudioRecorder();
  const [state, startIdling, startListening, startSpeaking, startThinking] =
    useKeimoStateStore(
      (store) => [
        store.state,
        store.startIdling,
        store.startListening,
        store.startSpeaking,
        store.startThinking,
      ],
      shallow
    );

  const [setUserMsg, setKeimoMsg] = useKeimoStateStore(
    (store) => [store.setUserMsg, store.setKeimoMsg],
    shallow
  );

  useEffect(() => {
    recorder.onSound(async (sound) => {
      // TODO: Replace this with actual speech recognition
      // Simulate thinking, then speaking, then back to idling
      startThinking();
      let res;
      try {
        res = await fetch('/api/process-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sound),
        });
      } catch (error) {
        console.error(error);
      }

      res = (await res?.json()) as {
        query: string;
        response: { text: string; audio: string };
      };
      setUserMsg(res.query);
      setKeimoMsg(res.response.text);

      const res_bin = atob(res.response.audio);
      var res_bytes = new Uint8Array(res_bin.length);
      for (var i = 0; i < res_bin.length; i++) {
        res_bytes[i] = res_bin.charCodeAt(i);
      }
      const audioBlob = new Blob([res_bytes], { type: 'audio/ogg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      startSpeaking();
      audio.addEventListener('ended', () => {
        startIdling();
      });
      await audio.play();
    });
  }, [setUserMsg, setKeimoMsg]);

  useEffect(() => {
    switch (state) {
      // Whenever the state changes to listening, start recording
      case State.LISTENING:
        recorder.start();
        break;
    }
  }, [state]);

  const handleClick = () => {
    // Idle -> Listening
    // Change the state to listening
    if (state === State.IDLE) {
      startListening();
    }

    // Listening -> Thinking
    // Stop recording and start thinking :)
    if (state === State.LISTENING) {
      recorder.stop();
    }
  };

  return (
    <button
      className={`
        h-16 w-16 flex justify-center items-center paper bg-green transition-colors duration-200 ease-in
        ${state === State.LISTENING && 'bg-red-500'}
        ${state === State.THINKING && 'bg-purple'}
        ${className}
      `}
      onClick={handleClick}
    >
      {renderIcon(state)}
    </button>
  );
}

/**
 * Renders the correct icon based on the state
 */
const renderIcon = (state: State) => {
  switch (state) {
    case State.LISTENING:
      return (
        <Image
          src="/icons/recording.svg"
          alt="Listening"
          width={32}
          height={32}
        />
      );
    case State.THINKING:
      return (
        <Image src="/icons/loading.svg" alt="Thinking" width={32} height={32} />
      );
    default:
      return (
        <Image
          src="/icons/microphone.svg"
          alt="Record"
          width={32}
          height={32}
        />
      );
  }
};
