import { setupMiddlewares, setupRoutes } from '#main/config'

import express from 'express'

export const setupApp = () => {
  const app = express()
  //setupMiddlewares(app)
  setupRoutes(app)
  return app
}
