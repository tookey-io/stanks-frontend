import { makeAutoObservable } from 'mobx';

import { AppConfig, SignatureData, UserSession, showConnect } from '@stacks/connect';
import { Wallet } from '@stacks/wallet-sdk';

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
          name: process.env.NEXT_PUBLIC_APP_NANE || 'Stanks',
          icon: 'https://tookey.io/icons/icon-256x256.png',
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

  saveStanksSignature(signature: SignatureData) {
    const user = this.getUser();
    if (user) {
      user.stanksSignature = signature;
      this.setUser(user);
    }
  }

  saveRpsSignature(signature: SignatureData) {
    const user = this.getUser();
    if (user) {
      user.rpsSignature = signature;
      this.setUser(user);
    }
  }

  saveRpsWallet(wallet: Wallet) {
    const user = this.getUser();
    if (user) {
      user.rpsWallet = wallet;
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
