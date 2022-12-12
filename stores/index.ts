import { createContext, useContext } from 'react';

import ApiService from '../services/api.service';
import AuthStore from './auth.store';
import HiroUserStore from './hiro-user.store';
import TwitterUserStore from './twitter-user.store';

export class RootStore {
  authStore: AuthStore;
  hiroUserStore: HiroUserStore;
  twitterUserStore: TwitterUserStore;

  constructor() {
    const apiService = new ApiService();

    this.authStore = new AuthStore(apiService);
    this.hiroUserStore = new HiroUserStore();
    this.twitterUserStore = new TwitterUserStore(this, apiService);
  }
}

export const StoresContext = createContext(new RootStore());
export const useStores = () => useContext(StoresContext);
