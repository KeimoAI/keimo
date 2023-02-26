import { create } from 'zustand';

export enum State {
  IDLE,
  LISTENING,
  THINKING,
  SPEAKING,
}

type StateT = State.IDLE | State.LISTENING | State.THINKING | State.SPEAKING;

type Store = {
  state: StateT;
  changeState: (state: StateT) => void;
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
