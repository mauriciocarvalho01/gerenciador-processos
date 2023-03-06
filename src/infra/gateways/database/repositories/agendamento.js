/* eslint-disable camelcase */
import { ApiHelper } from '#gateways/api-helpers'

export class Agendamento {
  constructor(apiOptions) {
    this.collection = apiOptions
    this.apiHelper = new ApiHelper(apiOptions)
  }

  findOne = async ({ pagina, andWhere }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('agendamento')
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

  findBy = async ({ pagina, andWhere }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('agendamento')
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
    if (data && status === 200) return data.registros
  }

  findAll = async ({ pagina }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('agendamento')
    const { status, data } = await this.apiHelper.send(this.apiHelper.convertParams({ pagina, parametros: {} }))

    if (status === 400) {
      console.log(`READ ERROR INFO: ${JSON.stringify(data)}`)
    }
    console.log(`READ STATUS: ${status}`)
    if (data && status === 200) return data.registros
  }

  updateBy = async ({ where, params }) => {
    const { id } = where
    this.collection.method('put')
    this.collection.takeAction('update')
    this.collection.endPoint(`agendamento/${id}`)
    const { data, status } = await this.apiHelper.send(params)

    if (status === 400) {
      console.log(`UPDATE ERROR INFO: ${JSON.stringify(data)}`)
    }
    console.log(`UPDATE STATUS: ${status}`)
    if (data && status === 200) return data
  }
}
