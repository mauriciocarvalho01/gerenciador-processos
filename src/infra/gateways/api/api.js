import { Http } from '#infra/http'
export class Api extends Http {
  constructor() {
    super()
    this.rootApiUrl = undefined
    this.systemUri = undefined
    this.gatewayUri = undefined
    this.takeActionUri = undefined
    this.endPoinUri = undefined
    this.secrets = undefined
    this.httpMethod = undefined
  }

  connect = (environment) => {
    this.rootApiUrl = `https://${environment}.arigo.com.br`
    return this
  }

  method = (method) => {
    this.httpMethod = method
  }

  system = (system) => {
    this.systemUri = system
    return this
  }

  gateway = (context) => {
    this.gatewayUri = context
    return this
  }

  takeAction = (action) => {
    this.takeActionUri = action
    return this
  }

  endPoint = (endPoint) => {
    this.endPoinUri = endPoint
    return this
  }

  token = (token) => {
    this.secrets = token
    return this
  }

  getSecrets = () => {
    return this.secrets
  }

  factoryApiUrl = () => {
    return `${this.rootApiUrl}/${this.systemUri}/${this.gatewayUri}/${this.takeActionUri}/${this.endPoinUri}`
  }

  send = async (body) => {
    const response = await this.sendHook(
      {
        url: this.factoryApiUrl(),
        retryIndex: 0,
        timeout: 8000,
        fetchOptions: {
          method: this.httpMethod,
          body
        }
      }
    )
    return response
  }
}
