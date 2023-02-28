'use client';

import { useEffect } from 'react';
import useKeimoStore, { State } from 'store/keimoStateStore';
import Image from 'next/image';

import AudioRecorder from 'lib/AudioRecorder';

export default function SpeakButton() {
  const { state, startIdling, startListening, startSpeaking, startThinking } =
    useKeimoStore();

  useEffect(() => {
    AudioRecorder.onSound(() => {
      // TODO: Replace this with actual speech recognition
      // Simulate thinking, then speaking, then back to idling
      startThinking();
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
        AudioRecorder.start();
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
      AudioRecorder.stop();
    }
  };

  return (
    <button
      className={`
        h-16 w-16 flex justify-center items-center paper bg-green transition-colors duration-200 ease-in
        ${state === State.LISTENING && 'bg-red-500'}
        ${state === State.THINKING && 'bg-purple'}
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
