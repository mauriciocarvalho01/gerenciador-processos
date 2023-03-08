
/* eslint-disable camelcase */
import fs from 'fs-extra'

import { ProcessNotFoundError, DepartmentNotFoundError } from '#application/errors'
import { Api, Agendamento, GrupoProcessos, GrupoTerceiros, Processos } from '#infra/gateways'
import { File } from '#tools/file'
import { Os } from '#tools/os'

export class Manager {
  constructor(worker) {
    this.worker = worker
  }

  manageProcessForWorker = async ({ broker, connection, departmentName, departmentPath }, callback) => {
    const api = new Api()
    api.connect(process.env.ENVIRONMENT).token({ appSecret: process.env.APP_SECRET, appKey: process.env.APP_KEY })
    api.system('tools')
    const agendamento = new Agendamento(api)
    const agendamentos = await agendamento.findBy({
      pagina: 1,
      andWhere: [
        { chave: 'agendamento_id_status', valor: '1' },
        { chave: 'agendamento_processando', valor: '1' }
      ]
    })

    if (agendamentos.length === 0) throw new ProcessNotFoundError(new Error('Não encontrado nenhum agendamento'))

    new File().readDir(departmentPath, async (error, services) => {
      if (error) throw new DepartmentNotFoundError(error)

      services.forEach(async (serviceName) => {
        const channel = await broker.createChannel({ connection })
        for (const agendamento of agendamentos) {
          const { agendamento_id_processos_parametros, agendamento_id_clientes, agendamento_id_agendamento } = agendamento
          api.system(departmentName)
          const grupoProcessos = new GrupoProcessos(api)
          const grupoProcesso = await grupoProcessos.findOne({
            pagina: 1,
            andWhere: [
              { chave: 'processos-parametros_id_processos_parametros', valor: agendamento_id_processos_parametros },
              { chave: 'grupo-processos_id_clientes', valor: agendamento_id_clientes }
            ]
          })
          if (grupoProcesso) {
            const { processos_parametros_id_processos, grupo_processos_id_grupo_processos } = grupoProcesso
            api.system('avalon')
            const processos = new Processos(api)
            const processo = await processos.findOne({
              pagina: 1,
              andWhere: [
                { chave: 'processos_id_processos', valor: processos_parametros_id_processos },
                { chave: 'processos_processos_tipo', valor: serviceName }
              ]
            })

            api.system('dfe')
            const grupoTerceiro = new GrupoTerceiros(api)
            const grupoTerceiros = await grupoTerceiro.findBy({
              pagina: 1,
              andWhere: [
                { chave: 'grupo-terceiros_id_grupo_processos', valor: grupo_processos_id_grupo_processos }
              ]
            })

            const workerGroupCount = parseInt(grupoTerceiros.length / new Os().countCpus())

            if (processo) {
              const { processos_tipo, processos_processo, processos_tipo_nome } = processo
              if (processos_tipo_nome === 'api') {
                const processName = `${processos_processo}`
                const processFullName = `${processos_tipo}_${processos_processo}`
                const queueName = this.resolveQueueName({ prefixQueue: agendamento_id_agendamento, processFullName })
                console.log(`Processo[${processName}] encontrado: ${departmentPath}/${serviceName}/${processName}`)
                const workerReport = await this.worker.createNewWorkerGroup({ broker, channel, workerGroupCount, processName, queueName, processPath: `${departmentPath}/${serviceName}/${processName}` })
                if (workerReport) console.log('manageProcessForWorker', workerReport.message)
                callback(workerReport)
              }
            } else {
              callback(new ProcessNotFoundError(new Error('Não encontrado nenhum processo')))
            }
          } else {
            callback(new ProcessNotFoundError(new Error('Não encontrado nenhum grupo processo')))
          }
        }
      })
    })
  }

  resolveQueueName = ({ prefixQueue, processFullName }) => {
    return `${processFullName}_${prefixQueue}`
  }
}
