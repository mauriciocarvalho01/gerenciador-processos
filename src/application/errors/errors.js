
export class DepartmentNotFoundError extends Error {
  constructor (error) {
    super('Não encontrado nenhum departamento!')
    this.name = 'DepartmentNotFoundError'
    this.stack = error?.stack
  }
}

export class ServiceNotFoundError extends Error {
  constructor (error) {
    super('Não encontrado nenhum serviço no setor especificado!')
    this.name = 'ServiceNotFoundError'
    this.stack = error?.stack
  }
}

export class ProcessNotFoundError extends Error {
  constructor (error) {
    super('Não encontrado nenhum processo para o serviço, no setor especificado!')
    this.name = 'ProcessNotFoundError'
    this.stack = error?.stack
  }
}

export class WorkerReportError extends Error {
  constructor (error) {
    super('O trabalhador reportou um erro!')
    this.name = 'WorkerReportError'
    this.stack = error?.stack
  }
}


export class XmlExtractReportError extends Error {
  constructor (error) {
    super('O extrator de Xml reportou um erro!')
    this.name = 'XmlExtract'
    this.stack = error?.stack
  }
}
