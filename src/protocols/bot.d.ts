export interface Bot {
  start(token: string): Promise<void>;
}
