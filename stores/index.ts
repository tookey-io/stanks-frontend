import { createContext, useContext } from 'react';
import GameStore from './game.store';
import HiroUserStore from './hiro-user.store';

export class RootStore {
  hiroUserStore: HiroUserStore;
  gameStore: GameStore;

  constructor() {
    this.hiroUserStore = new HiroUserStore();
    this.gameStore = new GameStore();
  }
}

export const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
