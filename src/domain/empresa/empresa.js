export class Empresa {
  constructor() {
    this.dados = {}
  }

  id = (id) => {
    if (id) this.dados.id = id
    return this
  }

  cnpj = (cnpj) => {
    if (cnpj.length === 14 || cnpj !== '00000000000000') this.dados.cnpj = cnpj
    return this
  }

  validaDados = () => {
    return Object.keys(this.dados).length > 0 ? this.dados : false
  }
}
