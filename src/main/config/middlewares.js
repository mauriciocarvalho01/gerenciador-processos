import { apmServer } from '#main/middlewares'
export const setupMiddlewares = (app) => {
  app.use(apmServer())
}
