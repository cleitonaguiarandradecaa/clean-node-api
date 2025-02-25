export class ServerError extends Error {
  constructor (stack?: string) {
    super('Internal sever error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
