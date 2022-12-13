import { createContext, useContext } from 'react';
import GameStore from './game.store';

import ApiService from '../services/api.service';
import HiroStore from './hiro.store';
import TwitterStore from './twitter.store';
import UserStore from './user.store';

export class RootStore {
  userStore: UserStore;
  hiroStore: HiroStore;
  twitterStore: TwitterStore;
  gameStore: GameStore;

  constructor() {
    const apiService = new ApiService();

    this.userStore = new UserStore(apiService);
    this.hiroStore = new HiroStore();
    this.twitterStore = new TwitterStore(apiService);
    this.gameStore = new GameStore();
  }
}

export const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
