
export class XmlFieldError extends Error {
  constructor (error) {
    super('Erro ao extrair campo do XML!')
    this.name = 'XmlFieldError'
    this.stack = error?.stack
  }
}
