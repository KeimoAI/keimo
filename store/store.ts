import create from 'zustand';

export enum States {
  IDLE,
  LISTENING,
  THINKING,
  SPEAKING,
}

type Store = {
  state: States;
  changeState: (state: States) => void;
};

const useStore = create<Store>()((set) => ({
  state: States.IDLE,
  changeState: (state: States) => set({ state }),
}));

export default useStore;
