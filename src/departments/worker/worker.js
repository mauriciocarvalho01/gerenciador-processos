import EventEmitter from 'events'

import { Worker as Task, isMainThread, MessageChannel } from 'worker_threads'
import { WorkerReportError } from '#application/errors'
import { MessageBroker } from '#gateways/message-broker'
import { File } from '#tools/file'
import { Os } from '#tools/os'

export class Worker {
  createNewWorkerGroup = ({ broker, channel, processName, processPath, queueName }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (isMainThread) {
        const workerPath = `${processPath}.js`
        if (await this.workerExists(workerPath)) {
          const workerData = { processName, processPath, queueName }
          const worker = new Task(workerPath, { workerData })
          resolve(await this.startWork({ worker, workerData, broker, channel }))
          worker.on('error', (error) => {
            console.log(error)
            resolve(new WorkerReportError(error))
          })
          worker.on('exit', (code) => {
            if (code !== 0) reject(new WorkerReportError(new Error(`Stopped the Worker Thread with the exit code: ${code}`)))
          })
        } else {
          resolve(new WorkerReportError(new Error(`Worker não encontrado: ${workerPath}`)))
        }
      }
    })
  }

  workerExists = async (workerPath) => {
    return await new File().fileExists(workerPath)
  }

  startWork = ({ worker, workerData, broker, channel }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const eventEmitter = new EventEmitter()
      const messages = await broker.consumeQueue({ channel, queueName: workerData.queueName, workerGroupCount: new Os().countCpus() })
      const timeout = setTimeout(async () => {
        eventEmitter.emit('consumeDone')
        console.info(`A verificação das mensagens na fila [${workerData.queueName}] terminou!`)
        console.info(`Total de mensagens:: ${messages.length}`)
        if (messages.length > 0) {
          const inQueue = true
          const messageBroker = new MessageBroker({ messages, inQueue })

          // Cria duas MessageChannels para enviar e receber mensagens
          const { port1: managerPort, port2: workerManagerPort } = new MessageChannel()
          const { port1: workerPort1, port2: ackMessagePort } = new MessageChannel()
          const { port1: workerPort2, port2: rejectMessagePort } = new MessageChannel()

          // Envia uma mensagem para o worker através do managerPort
          workerManagerPort.postMessage({ messageBroker })

          // Registra um callback para receber mensagens do worker através do ackMessagePort
          workerPort1.on('message', async (workerResponse) => {
            console.log(`Mensagem recebida do worker: ${workerResponse}`)
            workerResponse.messageBroker.channel = channel
            await broker.ackMessagesOfQueue(workerResponse)
            resolve('Item processado')
          })

          // Registra um callback para receber mensagens do worker através do rejectMessagePort
          workerPort2.on('message', async (workerResponse) => {
            console.log(`Mensagem recebida do worker: ${workerResponse}`)
            workerResponse.messageBroker.channel = channel
            await broker.rejectMessagePort(workerResponse)
            resolve('Item processado')
          })
          // Conecta as portas
          worker.postMessage({ managerPort, ackMessagePort, rejectMessagePort }, [managerPort, ackMessagePort, rejectMessagePort])
        } else {
          console.info('Nenhuma mensagem encontrada na fila')
          clearTimeout(timeout)
        }
      }, 10000)
      resolve(await new Promise(resolve => eventEmitter.once('consumeDone', resolve)))
    })
  }
}
