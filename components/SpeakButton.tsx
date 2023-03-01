'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import useKeimoStateStore, { State } from 'store/keimoStateStore';
import useAudioRecorder from 'lib/AudioRecorder';

export type Props = { className?: string };

export default function SpeakButton({ className }: Props) {
  const recorder = useAudioRecorder();
  const { state, startIdling, startListening, startSpeaking, startThinking } =
    useKeimoStateStore();

  useEffect(() => {
    recorder.onSound(async (sound) => {
      // TODO: Replace this with actual speech recognition
      // Simulate thinking, then speaking, then back to idling
      console.log(sound);
      startThinking();
      let result;
      try {
        result = await fetch('/api/transcribe', {
          method: 'POST',
          body: JSON.stringify({ sound }),
        });
      } catch (error) {
        console.error(error);
      }

      const { transcript } = await result?.json();

      console.log(transcript);

      setTimeout(() => {
        startSpeaking();
      }, 2000);
      setTimeout(() => {
        startIdling();
      }, 4000);
    });
  }, []);

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
