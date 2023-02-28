import { useCallback, useRef, useState } from 'react';

// The type of the callback function
type onSoundCallBack = () => void;

// The minimum decibels that we want to capture
const MIN_DECIBELS = -45;
// The amount of time we wait before we cut the recording
const MAX_PAUSE_DURATION = 2000;
// The interval at which we check for sound
const PAUSE_CHECK_INTERVAL = 500;

/**
 * AudioRecorder
 * - Handles recording audio
 * - Detects when user is done "speaking"
 */
export default function useAudioRecorder() {
  const streamBeingCaptured = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioBlobs = useRef<Blob[]>([]);
  const pausedTime = useRef(0);
  const pauseInterval = useRef<NodeJS.Timeout | null>(null);
  const onSoundCallback = useRef<onSoundCallBack | null>(null);
  const recording = useRef(false);

  // Stops the recording, calls the callback, and resets all the properties
  const stop = useCallback(() => {
    if (!recording.current) return;
    recording.current = false;

    // TODO: Remove audio playback, return the audio blob instead (Base64?)
    mediaRecorder.current?.addEventListener('stop', () => {
      const audioBlob = new Blob(audioBlobs.current);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      if (onSoundCallback.current) {
        onSoundCallback.current();
      }

      audio.play();
    });

    mediaRecorder.current?.stop();
    streamBeingCaptured.current?.getTracks().forEach((track) => {
      track.stop();
    });

    clearInterval(pauseInterval.current as NodeJS.Timeout);
    pauseInterval.current = null;
    pausedTime.current = 0;
  }, [recording]);

  // Callback for when sound is detected (On Result)
  const onSound = useCallback((callback: onSoundCallBack) => {
    onSoundCallback.current = callback;
  }, []);

  // Starts a timer to cut the recording after a certain amount of time
  const startTimer = useCallback(() => {
    // Don't start a new timer if one is already running
    if (pauseInterval.current || !recording.current) return;

    // Start a new timer
    pauseInterval.current = setInterval(() => {
      pausedTime.current += PAUSE_CHECK_INTERVAL;

      if (pausedTime.current >= MAX_PAUSE_DURATION) {
        stop();
      }
    }, PAUSE_CHECK_INTERVAL);
  }, [recording, stop]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    streamBeingCaptured.current = stream;
    mediaRecorder.current = new MediaRecorder(stream);
    audioBlobs.current = [];

    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        audioBlobs.current.push(event.data);
      }
    });

    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = MIN_DECIBELS;
    audioStreamSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectSound = () => {
      let soundDetected = false;

      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > 0) {
          soundDetected = true;
        }
      }

      // Start pause timer
      if (!soundDetected) {
        startTimer();
      }

      // Reset pause timer
      if (soundDetected) {
        pausedTime.current = 0;
      }

      // Don't request another animation frame if we're not recording
      if (recording.current) {
        window.requestAnimationFrame(detectSound);
      }
    };

    recording.current = true;
    mediaRecorder.current.start();

    window.requestAnimationFrame(detectSound);
  }, [recording, startTimer]);

  return {
    start,
    stop,
    onSound,
  };
}
