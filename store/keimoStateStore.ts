import { create } from 'zustand';

// Different Keimo states
export enum State {
  IDLE,
  LISTENING,
  THINKING,
  SPEAKING,
}

type StateT = State.IDLE | State.LISTENING | State.THINKING | State.SPEAKING;

/**
 * Zustand store for Keimo's state
 */
type Store = {
  state: StateT;
  startListening: () => void;
  startThinking: () => void;
  startSpeaking: () => void;
  startIdling: () => void;
};

const useKeimoStateStore = create<Store>()((set) => ({
  state: State.IDLE,
  startListening: () =>
    set(({ state }) => {
      if (state === State.IDLE) {
        return { state: State.LISTENING };
      }

      return {};
    }),
  startThinking: () =>
    set(({ state }) => {
      if (state === State.LISTENING) {
        return { state: State.THINKING };
      }

      return {};
    }),
  startSpeaking: () =>
    set(({ state }) => {
      if (state === State.THINKING) {
        return { state: State.SPEAKING };
      }

      return {};
    }),
  startIdling: () =>
    set(({ state }) => {
      if (state === State.SPEAKING) {
        return { state: State.IDLE };
      }

      return {};
    }),
}));

export default useKeimoStateStore;
