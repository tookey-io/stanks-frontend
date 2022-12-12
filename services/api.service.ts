import { AuthTokensRequestDto, AuthTokensResponseDto } from '../dto/auth/tokens.dto';
import { TweetResponseDto, TwitterAuthUrlResponseDto, TwitterUserDto } from '../dto/auth/twitter.dto';
import BaseHttpService from './base-http.service';

export default class ApiService extends BaseHttpService {
  async getTwitterAuthUrl(): Promise<TwitterAuthUrlResponseDto> {
    return (await this.get<TwitterAuthUrlResponseDto>(
      '/api/auth/twitter',
    )) as TwitterAuthUrlResponseDto;
  }

  async getTwitterAuthTokens(
    data: AuthTokensRequestDto,
  ): Promise<AuthTokensResponseDto> {
    return (await this.post<AuthTokensResponseDto>(
      '/api/auth/twitter',
      data,
    )) as AuthTokensResponseDto;
  }

  async getTwitterProfile(): Promise<TwitterUserDto> {
    return (await this.get<TwitterUserDto>(
      '/api/twitter/me',
    )) as TwitterUserDto;
  }

  async tweet(tweet: string): Promise<TweetResponseDto> {
    return (await this.post<TweetResponseDto>('/api/twitter/tweet', {
      tweet,
    })) as TweetResponseDto;
  }
}
