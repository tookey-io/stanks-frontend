import { createContext, useContext } from 'react';
import GameStore from './game.store';

import ApiService from '../services/api.service';
import AuthStore from './auth.store';
import HiroUserStore from './hiro-user.store';
import TwitterUserStore from './twitter-user.store';

export class RootStore {
  authStore: AuthStore;
  hiroUserStore: HiroUserStore;
  gameStore: GameStore;
  twitterUserStore: TwitterUserStore;

  constructor() {
    const apiService = new ApiService();

    this.authStore = new AuthStore(apiService);
    this.hiroUserStore = new HiroUserStore();
    this.gameStore = new GameStore();
    this.twitterUserStore = new TwitterUserStore(this, apiService);
  }
}

export const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
