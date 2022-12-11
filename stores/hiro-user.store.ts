import { makeAutoObservable } from 'mobx';

import { AppConfig, UserData, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default class HiroUserStore {
  user: UserData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  authenticate() {
    showConnect({
      appDetails: {
        name: 'Stunks',
        icon: window.location.origin + '/vercel.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        let user = userSession.loadUserData();
        this.setUser(user);
      },
      userSession: userSession,
    });
  }

  setUser(user: UserData | null) {
    this.user = user;
  }

  async logout(): Promise<void> {
    this.setUser(null);
  }

  async getUserProfile(): Promise<UserData | null> {
    return this.user;
  }
}
