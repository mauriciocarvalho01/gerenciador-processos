
export class XmlFieldError extends Error {
  constructor(error) {
    super('Erro ao extrair campo do XML!')
    this.name = 'XmlFieldError'
    this.stack = error?.stack
  }
}

export class DocumentError extends Error {
  constructor(error) {
    super('Erro no documento!')
    this.name = 'XmlFieldError'
    this.stack = error?.stack
  }
}

