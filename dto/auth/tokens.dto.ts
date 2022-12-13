export interface AuthTokenDto {
  token: string;
  validUntil: string;
}

export interface AuthTokensResponseDto {
  access: AuthTokenDto;
  refresh: AuthTokenDto;
}

export interface AuthTokensRequestDto {
  state: string;
  code: string;
}
