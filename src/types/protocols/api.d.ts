export interface Params {
  [key: string]: any;
  params?: { [key: string]: string | number };
}

export interface APIConfig {
  isLocal?: boolean;
  withToken?: boolean;
}

export interface RequestConfig extends Params, APIConfig {}
