'use client';
import { useEffect } from 'react';
import useStore, { State } from 'store/store';
import Image from 'next/image';

const MIN_DECIBELS = -45;

/**
 * AudioRecorder
 * - Handles recording audio
 */
const AudioRecorder = {
  audioBlob: [] as Blob[],
  mediaRecorder: null as MediaRecorder | null,
  streamBeingCaptured: null as MediaStream | null,

  start: async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    AudioRecorder.streamBeingCaptured = stream;
    AudioRecorder.mediaRecorder = new MediaRecorder(stream);
    AudioRecorder.audioBlob = [];

    AudioRecorder.mediaRecorder.addEventListener('dataavailable', (event) => {
      AudioRecorder.audioBlob.push(event.data);
    });

    AudioRecorder.mediaRecorder.start();
  },
  stop: () => {
    AudioRecorder.mediaRecorder?.addEventListener('stop', () => {
      console.log('Recording stopped');
      const audioBlob = new Blob(AudioRecorder.audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });

    AudioRecorder.cancel();
  },
  cancel: () => {
    AudioRecorder.mediaRecorder?.stop();
    AudioRecorder.streamBeingCaptured?.getTracks().forEach((track) => {
      track.stop();
    });
  },
};

export default function SpeakButton() {
  const { state, updateState } = useStore();

  useEffect(() => {
    switch (state) {
      case State.IDLE:
        break;
      case State.LISTENING:
        AudioRecorder.start();
        break;
      case State.THINKING:
        AudioRecorder.stop();
        break;
    }
  }, [state]);

  return (
    <button
      className={`
        h-16 w-16 flex justify-center items-center border-black border-2 rounded-xl bg-green transition-colors duration-200 ease-in
        ${state === State.LISTENING && 'bg-red-500'}
        ${state === State.THINKING && 'bg-purple'}
      `}
      onClick={() => {
        // Idle -> Listening
        if (state === State.IDLE) {
          updateState();
        }

        // Listening -> Thinking
        if (state === State.LISTENING) {
          updateState();

          // TEST: Simulate thinking && Speaking
          setTimeout(() => {
            updateState();

            // TEST: Simulate speaking
            setTimeout(() => {
              updateState();
            }, 2000);
          }, 2000);
        }
      }}
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
