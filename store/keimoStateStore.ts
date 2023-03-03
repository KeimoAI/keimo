import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Different Keimo states
export const State = {
  IDLE: 'idle' as const,
  LISTENING: 'listening' as const,
  THINKING: 'thinking' as const,
  SPEAKING: 'speaking' as const,
};

type StateT = (typeof State)[keyof typeof State];

/**
 * Zustand store for Keimo's state
 */
type Store = {
  state: StateT;
  dialog: {
    history: { userMsg: string; keimoMsg: string }[];
    current: { userMsg: string | undefined; keimoMsg: string | undefined };
  };
};

type Actions = {
  startListening: () => void;
  startThinking: () => void;
  startSpeaking: () => void;
  startIdling: () => void;

  setKeimoMsg: (msg: string) => void;
  setUserMsg: (msg: string) => void;
};

const useKeimoStateStore = create(
  immer<Store & Actions>((set) => ({
    state: State.IDLE,
    dialog: {
      history: [],
      current: {
        userMsg: undefined,
        keimoMsg: undefined,
      },
    },

    //
    // == State transitions ==
    //

    startListening: () =>
      set((store) => {
        if (store.state === State.IDLE || store.state === State.SPEAKING) {
          store.state = State.LISTENING;
        } else {
          console.error(
            `invalid keimo state transition ${store.state} to LISTENING.`
          );
        }
      }),
    startThinking: () =>
      set((store) => {
        if (store.state === State.LISTENING) {
          store.state = State.THINKING;
        } else {
          console.error(
            `invalid keimo state transition ${store.state} to THINKING.`
          );
        }
      }),
    startSpeaking: () =>
      set((store) => {
        if (store.state === State.THINKING) {
          store.state = State.SPEAKING;
        } else {
          console.error(
            `invalid keimo state transition ${store.state} to SPEAKING.`
          );
        }
      }),
    startIdling: () =>
      set((store) => {
        if (store.state === State.SPEAKING) {
          store.state = State.IDLE;
        } else {
          console.error(
            `invalid keimo state transition ${store.state} to IDLE.`
          );
        }
      }),

    //
    // == Dialog controls
    //
    setKeimoMsg: (msg) =>
      set((store) => {
        if (store.state !== State.SPEAKING) {
          console.error('Keimo cannot speak when not in speak state!');
        }

        store.dialog.current.keimoMsg = msg;
      }),

    setUserMsg: (msg) =>
      set((store) => {
        if (store.state !== State.LISTENING) {
          console.error("User cannot speak when keimo isn't listening!");
        }

        store.dialog.current.userMsg = msg;
      }),
  }))
);

export default useKeimoStateStore;
