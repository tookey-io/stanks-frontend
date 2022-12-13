export interface TwitterAuthUrlResponseDto {
  url: string;
}

export interface TwitterUserDto {
  id: number;
  twitterId: string;
  name?: string;
  username?: string;
  tweet?: TweetResponseDto;
}

export interface TweetResponseDto {
  id: string;
  text: string;
}
