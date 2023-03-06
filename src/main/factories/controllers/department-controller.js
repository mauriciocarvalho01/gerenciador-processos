import { DepartmentController } from '#controllers/department-controller'

export const makeDepartmentController = async () => {
  const departmentController = new DepartmentController()
  return await departmentController.perform()
}

