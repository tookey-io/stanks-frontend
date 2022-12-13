import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';

import { APIErrorResponse } from '../dto/api/api-error-response.dto';
import { AuthTokensResponseDto } from '../dto/auth/tokens.dto';

export default class BaseHttpService {
  _accessToken: string | null = null;
  _refreshToken: string | null = null;

  async get<T = any>(
    endpoint: string,
    options: AxiosRequestConfig = {},
  ): Promise<T | void> {
    Object.assign(options, this._getCommonOptions());
    return axios
      .get<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, options)
      .then((res: AxiosResponse<T>) => res.data)
      .catch((error: AxiosError<APIErrorResponse>) =>
        this._handleHttpError(error),
      );
  }

  async post<T = any>(
    endpoint: string,
    data: any = {},
    options: AxiosRequestConfig = {},
  ): Promise<T | void> {
    Object.assign(options, this._getCommonOptions());
    return axios
      .post<T>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        data,
        options,
      )
      .then((res: AxiosResponse<T>) => res.data)
      .catch((error: AxiosError<APIErrorResponse>) =>
        this._handleHttpError(error),
      );
  }

  async delete<T = any>(
    endpoint: string,
    options: AxiosRequestConfig = {},
  ): Promise<T | void> {
    Object.assign(options, this._getCommonOptions());
    return axios
      .delete<T>(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, options)
      .then((res: AxiosResponse<T>) => res.data)
      .catch((error: AxiosError<APIErrorResponse>) =>
        this._handleHttpError(error),
      );
  }

  async patch<T = any>(
    endpoint: string,
    data: any = {},
    options: AxiosRequestConfig = {},
  ): Promise<T | void> {
    Object.assign(options, this._getCommonOptions());
    return axios
      .patch<T>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        data,
        options,
      )
      .then((res: AxiosResponse<T>) => res.data)
      .catch((error: AxiosError<APIErrorResponse>) =>
        this._handleHttpError(error),
      );
  }

  _handleHttpError(error: AxiosError<APIErrorResponse>) {
    if (error?.response?.data) {
      const { statusCode } = error?.response?.data;

      const requestUrl = error.response?.config.url;

      if (statusCode !== 401 || requestUrl?.endsWith('/api/auth/refresh')) {
        throw error.response.data;
      } else {
        return this._handle401(error);
      }
    } else {
      throw error;
    }
  }

  _handle401(error: AxiosError<APIErrorResponse>) {
    this.post('/api/auth/refresh', null, this._getRefreshOptions())
      .then(() => axios.request(error.config!))
      .catch((e) => {
        if (typeof window !== 'undefined') {
          Router.push('/auth');
        }
      });
  }

  _getCommonOptions() {
    if (this.accessToken) {
      return {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      };
    }

    return {};
  }

  _getRefreshOptions() {
    if (this.accessToken) {
      return {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      };
    }

    return {};
  }

  get accessToken() {
    return this._accessToken ? this._accessToken : this.loadAccessToken();
  }

  get refreshToken() {
    return this._refreshToken ? this._refreshToken : this.loadRefreshToken();
  }

  saveTokens(tokens: AuthTokensResponseDto) {
    this._accessToken = tokens.access.token;
    this._refreshToken = tokens.refresh.token;
    localStorage.setItem('accessToken', this._accessToken);
    localStorage.setItem('refreshToken', this._refreshToken);
  }

  loadAccessToken() {
    const accessToken = localStorage.getItem('accessToken') as string;
    this._accessToken = accessToken;
    return accessToken;
  }

  loadRefreshToken() {
    const accessToken = localStorage.getItem('accessToken') as string;
    this._accessToken = accessToken;
    return accessToken;
  }

  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
