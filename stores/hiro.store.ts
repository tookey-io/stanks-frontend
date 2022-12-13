import { makeAutoObservable } from 'mobx';

import { AppConfig, SignatureData, UserSession, showConnect } from '@stacks/connect';

import { HiroUserDto } from '../dto/auth/hiro.dto';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default class HiroStore {
  _user: HiroUserDto | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  connect(): Promise<HiroUserDto | null> {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: 'Stanks',
          icon: window.location.origin + '/vercel.svg',
        },
        redirectTo: '/',
        onFinish: () => {
          const user = userSession.loadUserData();
          if (user) {
            this.setUser(user);
            resolve(user);
          } else {
            reject(null);
          }
        },
        onCancel: () => {
          reject(null);
        },
        userSession,
      });
    });
  }

  saveSignature(signature: SignatureData) {
    const user = this.getUser();
    if (user) {
      user.signatureData = signature;
      this.setUser(user);
    }
  }

  setUser(user: HiroUserDto | null) {
    this._user = user;
    localStorage.setItem('hiro', JSON.stringify(user));
    return this._user;
  }

  getUser(): HiroUserDto | null {
    const user = localStorage.getItem('hiro') as string;
    if (user) this._user = JSON.parse(user);
    return this._user;
  }

  async clearStorage(): Promise<void> {
    localStorage.removeItem('hiro');
    this._user = null;
  }
}
