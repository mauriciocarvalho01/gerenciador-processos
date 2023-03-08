
import fs from 'fs-extra'

import { ServiceNotFoundError } from '#application/errors'
import { RabbitMQ } from '#gateways/rabbitmq'
const broker = RabbitMQ.getInstance()

export class Department {
  constructor(manager) {
    this.manager = manager
  }

  async serviceForManager(departmentServicesPath, callback) {
    fs.readdir(departmentServicesPath, async (error, departments) => {
      if (error) {
        callback(new ServiceNotFoundError(error))
      } else {
        departments.forEach(async (departmentName) => {
          const connection = await broker.createConnection(departmentName)
          console.log(`Servico[${departmentName}] encontrado: ${departmentServicesPath}/${departmentName}`)
          await this.manager.manageProcessForWorker(
            {
              broker,
              connection,
              departmentName,
              departmentPath: `${departmentServicesPath}/${departmentName}`
            },
            (workerReport) => {
              if (workerReport?.message) {
                callback(workerReport.message)
              } else {
                console.log('serviceForManager', workerReport)
              }
            }
          )
        })
      }
    })
  }
}
