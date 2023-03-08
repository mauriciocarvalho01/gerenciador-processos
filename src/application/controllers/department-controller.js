import fs from 'fs-extra'

import { Department } from '#adm/department'
import { Manager } from '#adm/manager'
import { Worker } from '#worker/worker'

export class DepartmentController {
  constructor() {
    this.department = new Department(new Manager(new Worker()))
  }

  async perform() {
    try {
      const departmentServicesPath = `${process.cwd()}/src/departments/services`
      console.log(`Services Path: ${departmentServicesPath}`)
      await this.department.serviceForManager(departmentServicesPath, (report) => {
        console.log('perform', report)
      })
    } catch (error) {
      console.log(error.message)
    }
  }
}
