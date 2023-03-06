import { Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const setupRoutes = (app) => {
  const router = Router()
  app.get('/', function(req, res){
    res.status(200).json({ success: true })
  })
  app.use('/api', router)
  readdirSync(path.join(__dirname, '../routes')).map(async file => {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
