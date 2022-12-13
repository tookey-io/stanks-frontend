import { makeAutoObservable } from 'mobx';

import { AuthTokensResponseDto } from '../dto/auth/tokens.dto';
import ApiService from '../services/api.service';

export default class UserStore {
  constructor(private readonly apiService: ApiService) {
    makeAutoObservable(this);
  }

  saveTokens(tokens: AuthTokensResponseDto) {
    this.apiService.saveTokens(tokens);
  }
}
