import dotenv from 'dotenv'
import { setupApp } from '#main/config'
import { makeDepartmentController } from '#factories/factories'
dotenv.config()

const app = setupApp()
app.listen(process.env.PORT, async () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`)
  await makeDepartmentController()
})
