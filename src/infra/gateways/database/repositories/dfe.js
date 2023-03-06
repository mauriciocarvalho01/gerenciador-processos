import { ApiHelper } from '#gateways/api-helpers'

export class Dfe {
  constructor(apiOptions) {
    this.collection = apiOptions
    this.apiHelper = new ApiHelper(apiOptions)
  }

  findOne = async ({ pagina, andWhere }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('dfe')
    const parametros = andWhere.reduce((previousValue, currentValue) => {
      previousValue.e[currentValue.chave] = {
        tipo: 'IGUAL',
        valor: currentValue.valor
      }
      return previousValue
    }, { e: {} })

    const { data, status } = await this.apiHelper.send(
      this.apiHelper.convertParams({ pagina, parametros })
    )
    if (status === 400) {
      console.log(`READ ERROR INFO: ${JSON.stringify(data)}`)
    }
    console.log(`READ STATUS: ${status}`)
    if (data && status === 200) return data.registros[0]
  }

  findAll = async ({ pagina }) => {
    this.collection.method('post')
    this.collection.takeAction('read')
    this.collection.endPoint('dfe')
    const { data, status } = await this.apiHelper.send(this.apiHelper.convertParams({ pagina, parametros: {} }))
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
    this.collection.endPoint(`dfe/${id}`)
    const { data, status } = await this.apiHelper.send(params)
    console.log(`UPDATE STATUS: ${status}`)
    if (status === 400) {
      console.log(`UPDATE ERROR INFO: ${JSON.stringify(data)}`)
    }
    if (data && status === 200) return data
  }

  create = async ({ params }) => {
    this.collection.method('post')
    this.collection.takeAction('replace')
    this.collection.endPoint('dfe')
    const { data, status } = await this.apiHelper.send(params)
    console.log(`CREATE STATUS: ${status}`)
    if (status === 400) {
      console.log(`CREATE ERROR INFO: ${JSON.stringify(data)}`)
      console.log(`CREATE ERROR BODY: ${JSON.stringify(params)}`)
    }
    if (data && status === 201) return data
  }
}
