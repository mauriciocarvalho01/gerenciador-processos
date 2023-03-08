/* eslint-disable camelcase */
import { Http } from '#infra/http'

export class SiegApiHelper extends Http {
  constructor(url) {
    super()
    this.apiXmlSearch = url
    this.apiTimeout = 40000
    this.apikey = undefined
    this.email = undefined
    this.xmltype = undefined
    this.dataInicio = undefined
    this.dataFim = undefined
    this.cnpjDest = undefined
    this.cnpjEmit = undefined
    this.cnpjTom = undefined
    this.downloadevent = false
    this.take = 50
    this.pagina = 0
    this.body = {}
  }

  token = ({ apikey, email }) => {
    this.body.apikey = apikey
    this.body.email = email
    return this
  }

  competencia = ({ dataInicio, dataFim }) => {
    this.body.dataInicio = dataInicio
    this.body.dataFim = dataFim
    return this
  }

  // nfse entradas
  // nfe entradas
  cnpjDestino = (cnpj) => {
    this.body.cnpjDest = cnpj
    return this
  }

  // nfse saidas
  cnpjPrestador = (cnpj) => {
    this.body.cnpjEmit = cnpj
    return this
  }

  // nfe saidas
  // cfe saidas
  // cte saidas
  cnpjEmitente = (cnpj) => {
    this.body.cnpjEmit = cnpj
    return this
  }

  // cte entradas
  cnpjTomador = (cnpj) => {
    this.body.cnpjTom = cnpj
    return this
  }

  tipoXml = (tipo) => {
    this.body.xmltype = tipo
    return this
  }

  paginacao = ({ take, skip }) => {
    this.body.take = take
    this.body.skip = skip
    return this
  }

  download = (download) => {
    this.body.downloadevent = download
    return this
  }

  getBody = () => {
    const body = this.body
    return body
  }

  convert = (params) => {
    return JSON.stringify(params)
  }

  consumeApi = async (body) => {
    const response = await this.sendHook(
      {
        url: this.apiXmlSearch,
        retryIndex: 0,
        timeout: 20000,
        fetchOptions: {
          method: 'post',
          body: this.convert(body)
        }
      }
    )
    console.log(`SIEG STATUS: ${response.status}`)
    if (response.status === 200) return response
  }
}
