import { makeAutoObservable } from 'mobx';

import { AuthTokensRequestDto, AuthTokensResponseDto } from '../dto/auth/tokens.dto';
import { TweetResponseDto, TwitterUserDto } from '../dto/auth/twitter.dto';
import ApiService from '../services/api.service';

export default class TwitterStore {
  _user: TwitterUserDto | null = null;

  constructor(private readonly apiService: ApiService) {
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
    const tweet = await this.apiService.tweet(text);
    if (tweet) this.saveTweet(tweet);
    return tweet;
  }

  saveTweet(tweet: TweetResponseDto) {
    const user = this.getUser();
    if (user) {
      user.tweet = tweet;
      this.setUser(user);
    }
  }

  setUser(user: TwitterUserDto | null) {
    this._user = user;
    localStorage.setItem('twitter', JSON.stringify(user));
    return this._user;
  }

  getUser(): TwitterUserDto | null {
    const user = localStorage.getItem('twitter') as string;
    if (!user) return null;
    this._user = JSON.parse(user);
    return this._user;
  }

  async loadUser() {
    const user = await this.apiService.getTwitterProfile();
    if (!user) return null;
    this.setUser(user);
    this._user = user;
    return this._user;
  }

  async clearStorage(): Promise<void> {
    localStorage.removeItem('twitter');
    this._user = null;
  }
}
