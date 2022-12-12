export interface TwitterAuthUrlResponseDto {
  url: string;
}

export interface TwitterUserDto {
  id: number;
  twitterId: string;
  name?: string;
  username?: string;
}

export interface TweetResponseDto {
  id: string;
  text: string;
}
