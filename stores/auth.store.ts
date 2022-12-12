import { makeAutoObservable } from 'mobx';

import ApiService from '../services/api.service';

export default class AuthStore {
  constructor(private readonly apiService: ApiService) {
    makeAutoObservable(this);
  }

  saveToken(token: string) {
    this.apiService.saveToken(token);
  }
}
