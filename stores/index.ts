import { createContext, useContext } from 'react';

import HiroUserStore from './hiro-user.store';

export class RootStore {
  hiroUserStore: HiroUserStore;

  constructor() {
    this.hiroUserStore = new HiroUserStore();
  }
}

export const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
