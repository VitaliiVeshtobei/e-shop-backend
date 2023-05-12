export class HttpError extends Error {
  code: number;
  constructor(message = 'Unknown error', code: number) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
