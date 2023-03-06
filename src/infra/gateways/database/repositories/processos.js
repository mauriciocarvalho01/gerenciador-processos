/* eslint-disable camelcase */
import { ApiHelper } from '#gateways/api-helpers'

export class Processos {
  constructor(apiOptions) {
    this.collection = apiOptions
    this.apiHelper = new ApiHelper(apiOptions)
  }

  findOne = async ({ pagina, andWhere }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('processos')
    const parametros = andWhere.reduce((previousValue, currentValue) => {
      previousValue.e[currentValue.chave] = {
        tipo: 'IGUAL',
        valor: currentValue.valor
      }
      return previousValue
    }, { e: {} })

    const { status, data } = await this.apiHelper.send(
      this.apiHelper.convertParams({ pagina, parametros })
    )

    if (status === 400) {
      console.log(`READ ERROR INFO: ${JSON.stringify(data)}`)
    }
    console.log(`READ STATUS: ${status}`)
    if (data && status === 200) return data.registros[0]
  }
}
