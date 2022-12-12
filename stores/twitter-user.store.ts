import { makeAutoObservable } from 'mobx';

import { AuthTokensRequestDto, AuthTokensResponseDto } from '../dto/auth/tokens.dto';
import { TweetResponseDto, TwitterUserDto } from '../dto/auth/twitter.dto';
import ApiService from '../services/api.service';
import { RootStore } from './';

export default class TwitterUserStore {
  user: TwitterUserDto | null = null;

  constructor(
    private readonly rootStore: RootStore,
    private readonly apiService: ApiService,
  ) {
    makeAutoObservable(this);
  }

  async getAuthUrl() {
    return await this.apiService.getTwitterAuthUrl();
  }

  async getAuthTokens(
    data: AuthTokensRequestDto,
  ): Promise<AuthTokensResponseDto> {
    return await this.apiService.getTwitterAuthTokens(data);
  }

  async tweet(text: string): Promise<TweetResponseDto> {
    return await this.apiService.tweet(text);
  }

  setUser(user: TwitterUserDto | null) {
    this.user = user;
  }

  async logout(): Promise<void> {
    this.setUser(null);
  }

  async getUserProfile(): Promise<TwitterUserDto> {
    const user = await this.apiService.getTwitterProfile();
    this.user = user;
    return user;
  }
}
