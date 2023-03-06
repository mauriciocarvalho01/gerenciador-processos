import express from 'express'
import apm from 'elastic-apm-node'

export const apmServer = () => {
  const monitoring = apm.start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: process.env.APP_NAME,

    // Use if APM Server requires a token
    secretToken: '',

    // Use if APM Server uses API keys for authentication
    apiKey: '',

    // Set custom APM Server URL (default: http://127.0.0.1:8200)
    serverUrl: process.env.APM_URL
  })
  return monitoring.middleware.connect()
}




