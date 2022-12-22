export class RequestError extends Error {
  status: number;

  constructor(name = 'axios error', message = 'unexpected error', status = 400) {
    super();
    this.message = message;
    this.status = status;
    this.name = name;
  }
}
