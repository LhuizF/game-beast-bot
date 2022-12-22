import axios, { AxiosError } from 'axios';
import { RequestError } from '../errors';
import { APIConfig, RequestConfig } from '../types/protocols/api';

const localBaseUrl = 'http://localhost:3333/v1';

class Api {
  private readonly startConfig = {} as APIConfig;

  constructor(startConfig = {} as APIConfig) {
    this.startConfig = startConfig;
  }

  private requestConfig(config: APIConfig) {
    const baseURL = config.isLocal || this.startConfig.isLocal ? localBaseUrl : '';

    const headers = {
      discord_token:
        config.withToken || this.startConfig.withToken
          ? 'bot-token ' + process.env.DISCORD_TOKEN
          : ''
    };

    return axios.create({
      baseURL,
      headers
    });
  }

  async get<T>(path: string, configs = {} as RequestConfig) {
    const { params, isLocal, withToken } = configs;
    const api = this.requestConfig({ isLocal, withToken });

    return await api
      .get<T>(path, { params })
      .then((res) => res.data)
      .catch(this.handleError);
  }

  async post<T>(path: string, configs = {} as RequestConfig) {
    const { params, isLocal, withToken, ...data } = configs;
    const api = this.requestConfig({ isLocal, withToken });

    return await api
      .post<T>(path, { params, ...data })
      .then((res) => res.data)
      .catch(this.handleError);
  }

  async put<T>(path: string, configs = {} as RequestConfig) {
    const { params, isLocal, withToken, ...data } = configs;
    const api = this.requestConfig({ isLocal, withToken });

    return await api
      .put<T>(path, { params, ...data })
      .then((res) => res.data)
      .catch(this.handleError);
  }

  private handleError(err: AxiosError): RequestError {
    console.log('handleError', err?.response);
    if (axios.isAxiosError(err)) {
      const response = err.response?.data as any;
      return new RequestError(
        err.response?.statusText,
        response?.message,
        err.response?.status
      );
    }
    // log
    return new RequestError('', '', 500);
  }
}

export default new Api({ isLocal: true, withToken: true });
