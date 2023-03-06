export class HttpError extends Error {
  constructor(error) {
    super('Erro no protocolo HTTP!')
    this.name = 'HttpError'
    this.stack = error?.stack
  }
}
