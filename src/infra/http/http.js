import { HttpError } from '#infra/errors'

import fetch from 'node-fetch'
import http from 'node:http'
import https from 'node:https'

export class Http {
  constructor() {
    this.headers = { 'Content-Type': 'application/json' }
    this.httpAgent = new http.Agent({
      keepAlive: true
    })
    this.httpsAgent = new https.Agent({
      keepAlive: true
    })
  }

  async sendHook(httpOptions) {
    const controller = new AbortController()
    const controllerId = setTimeout(() => {
      controller.abort()
    }, httpOptions.timeout)
    const { url, retryIndex, fetchOptions } = httpOptions
    console.log(`Request Url: ${url}`)
    fetchOptions.headers = this.headers
    fetchOptions.signal = controller.signal
    fetchOptions.agent = (_parsedURL) => _parsedURL.protocol === 'http:' ? this.httpAgent : this.httpsAgent
    return await fetch(url, fetchOptions)
      .then(async (response) => {
        const data = await response.json()
        response = { status: response.status, data }
        clearTimeout(controllerId)
        return response
      })
      .catch(async (error) => {
        console.log(`HTTP ERROR: ${error.message}`)
        console.log(`HTTP STATUS: ${error.status}`)
        console.log(`HTTP OPTIONS: ${JSON.stringify(httpOptions)}`)
        if (retryIndex < process.env.MAX_HTTP_RETRY_ATTEMPTS) {
          ++httpOptions.retryIndex
          console.log(`Refazendo a requisição...${httpOptions.retryIndex}`)
          return await this.sendHook(httpOptions)
        }
        throw new HttpError(new Error(error.message))
      })
  }
}
