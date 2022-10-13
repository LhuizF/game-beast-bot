import axios, { AxiosError, AxiosInstance } from 'axios';

interface GetParams {
  params?: { [key: string]: string | number };
}

interface PostParams {
  [key: string]: any;
  params?: { [key: string]: string | number };
}

export class RequestError extends Error {
  status: number;
  constructor(name = 'axios error', message = 'unexpected error', status = 400) {
    super();
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class Api {
  private readonly api: AxiosInstance;

  constructor(private readonly baseUrl: string) {
    const url = process.env.DEV ? 'http://localhost:3333/v1' : this.baseUrl;
    this.api = axios.create({
      baseURL: url
    });
  }

  async get<T>(path: string, params?: GetParams) {
    return await this.api
      .get<T>(path, { ...params })
      .then((res) => res.data)
      .catch(this.handleError);
  }

  async post<T>(path: string, params?: PostParams) {
    return await this.api
      .post<T>(path, { ...params })
      .then((res) => res.data)
      .catch(this.handleError);
  }

  handleError(err: AxiosError): RequestError {
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

export default new Api('');
