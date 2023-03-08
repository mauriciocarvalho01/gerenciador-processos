export class Empresa {
  constructor () {
    this.dados = {}
  }

  id = (id) => {
    if (id) this.dados.id = id
    return this
  }

  cnpj = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (cnpj.length !== 14) return this

    let digitosIguais = 1
    for (let i = 0; i < cnpj.length - 1; i++) {
      if (cnpj.charAt(i) !== cnpj.charAt(i + 1)) {
        digitosIguais = 0
        break
      }
    }

    if (digitosIguais) return this

    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== digitos.charAt(0)) return this

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== digitos.charAt(1)) return this

    this.dados.cnpj = cnpj
    return this
  }

  validaDados = () => {
    return Object.keys(this.dados).length > 0 ? this.dados : false
  }
}
