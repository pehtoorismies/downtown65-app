export class HttpRequestError extends Error {
  constructor(public statusCode: number, public message: string) {
    super()
  }
}
