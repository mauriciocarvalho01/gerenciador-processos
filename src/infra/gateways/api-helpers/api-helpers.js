export class ApiHelper {
  constructor (api) {
    this.api = api
    this.api.gateway('api')
  }

  convert (params) {
    const { appSecret, appKey } = this.api.getSecrets()
    return JSON.stringify({
      app_secret: appSecret,
      app_key: appKey,
      params
    })
  }

  convertParams = ({ pagina, parametros }) => {
    return {
      pagina,
      filtro: {
        campos: parametros
      }
    }
  }

  async send (query) {
    return await this.api.send(this.convert(query))
  }
}
