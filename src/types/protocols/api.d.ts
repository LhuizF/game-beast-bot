export class RequestError extends Error {
  status: number;

  constructor(name = 'axios error', message = 'unexpected error', status = 400) {
    super();
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

export interface Params {
  [key: string]: any;
  params?: { [key: string]: string | number };
}

export interface APIConfig {
  isLocal?: boolean;
  withToken?: boolean;
}

export interface RequestConfig extends Params, APIConfig {}
