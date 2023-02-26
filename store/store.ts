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
  /**
   * To change Keimo's state to a specific state
   * @warning This function is not meant to be called directly, should be used for testing purposes only
   * @param state {StateT} State to change to
   * @returns {void}
   */
  changeState: (state: StateT) => void;
  /**
   * State machine
   * @returns {void}
   */
  updateState: () => void;
};

const useStore = create<Store>()((set) => ({
  state: State.IDLE,
  changeState: (state: StateT) => set({ state }),
  updateState: () =>
    set((state) => {
      let newState: StateT = state.state;

      switch (state.state) {
        case State.IDLE:
          newState = State.LISTENING;
          break;
        case State.LISTENING:
          newState = State.THINKING;
          break;
        case State.THINKING:
          newState = State.SPEAKING;
          break;
        case State.SPEAKING:
          newState = State.IDLE;
          break;
      }

      return { state: newState };
    }),
}));

export default useStore;
