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
const AudioRecorder = {
  audioBlob: [] as Blob[],
  mediaRecorder: null as MediaRecorder | null,
  streamBeingCaptured: null as MediaStream | null,
  recording: false,
  pausedTime: 0,
  interval: null as NodeJS.Timeout | null,
  onSoundCallback: null as (() => void) | null,

  start: async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    AudioRecorder.streamBeingCaptured = stream;
    AudioRecorder.mediaRecorder = new MediaRecorder(stream);
    AudioRecorder.audioBlob = [];

    AudioRecorder.mediaRecorder.addEventListener('dataavailable', (event) => {
      AudioRecorder.audioBlob.push(event.data);
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
        AudioRecorder.startTimer();
      }

      // Reset pause timer
      if (soundDetected) {
        AudioRecorder.pausedTime = 0;
      }

      // Don't request another animation frame if we're not recording
      if (AudioRecorder.recording) {
        window.requestAnimationFrame(detectSound);
      }
    };

    window.requestAnimationFrame(detectSound);

    AudioRecorder.recording = true;
    AudioRecorder.mediaRecorder.start();
  },
  stop: () => {
    if (!AudioRecorder.recording) return;

    AudioRecorder.mediaRecorder?.addEventListener('stop', () => {
      const audioBlob = new Blob(AudioRecorder.audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      if (AudioRecorder.onSoundCallback) {
        AudioRecorder.onSoundCallback();
      }
      audio.play();
    });

    AudioRecorder.cancel();
  },
  cancel: () => {
    AudioRecorder.recording = false;
    AudioRecorder.mediaRecorder?.stop();
    AudioRecorder.streamBeingCaptured?.getTracks().forEach((track) => {
      track.stop();
    });
    AudioRecorder.pausedTime = 0;
    clearInterval(AudioRecorder.interval as NodeJS.Timeout);
  },
  // Starts a timer to cut the recording after a certain amount of time
  startTimer: () => {
    // Don't start a new timer if one is already running
    if (AudioRecorder.interval) return;

    // Start a new timer
    AudioRecorder.interval = setInterval(() => {
      AudioRecorder.pausedTime += PAUSE_CHECK_INTERVAL;

      if (AudioRecorder.pausedTime >= MAX_PAUSE_DURATION) {
        AudioRecorder.stop();
      }
    }, PAUSE_CHECK_INTERVAL);
  },
  // Callback for when sound is detected (On Result)
  onSound: (callback: () => void) => {
    AudioRecorder.onSoundCallback = callback;
  },
};

export default AudioRecorder;
