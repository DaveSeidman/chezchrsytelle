import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(devtools(set => ({
  user: { _id: null, displayName: null, googleId: null },
  setStoreUser: nextUser => set({ user: nextUser }),
})));

export default useStore;
