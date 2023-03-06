/* eslint-disable camelcase */
/* eslint-disable no-const-assign */
import * as amqp from 'amqplib'
import EventEmitter from 'events'
import { AgendamentoExecucao, Api, Agendamento } from '#infra/gateways'
import { Moment } from '#tools/datetime'

export class RabbitMQ {

  static getInstance() {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ()
      RabbitMQ.instance.connection = null
      console.log('RabbitMQ instance is active')
    }
    return RabbitMQ.instance
  }

  createConnection = async (connectionName) => {
    if (RabbitMQ.instance.connection === null) {
      const options = { clientProperties: { connection_name: connectionName } }
      RabbitMQ.instance.connection = await amqp.connect(process.env.RABBITMQ_URL, options)
      console.log('Connected to RabbitMQ Connetion', RabbitMQ.instance.connection.connection.serverProperties)
    }
    return RabbitMQ.instance.connection
  }

  getConnection = async (connectionId) => {
    if (RabbitMQ.instance.connection === null) {
      RabbitMQ.instance.connection = await amqp.getConnection(connectionId)
      console.log('Find Connetion', RabbitMQ.instance.connection.connection.serverProperties)
    }
    return RabbitMQ.instance.connection
  }

  createChannel = async ({ connection }) => {
    try {
      const channel = await connection.createChannel()
      console.log('Connected to RabbitMQ Channel', channel.ch)
      return channel
    } catch (error) {
      throw new Error(error.message)
    }
  }

  consumeQueue = async ({ channel, queueName, workerGroupCount }) => {
    const eventEmitter = new EventEmitter()
    const queue = await channel.assertQueue(queueName)
    const prefecth = parseInt(queue.messageCount / workerGroupCount)
    console.log('Grupo de workers', workerGroupCount)
    await channel.prefetch(prefecth)
    console.log('Tarefa por grupo de  workers', prefecth)
    const messageRepository = []
    await channel.consume(queueName, async (rabbitmqMessage) => {
      console.log(`Verificando mensagens na fila [${queueName}]...`)
      console.log(`Indice da fila: ${rabbitmqMessage.fields.deliveryTag}`)
      messageRepository.push({ queueLength: queue.messageCount, buffer: rabbitmqMessage, content: JSON.parse(rabbitmqMessage.content) })
      if (rabbitmqMessage.fields.deliveryTag === queue.messageCount) {
        eventEmitter.emit('consumeDone')
      }
    }, {
      noAck: false
    })
    return messageRepository
  }

  ackMessagesOfQueue = async (options) => {
    const {
      message,
      checksum,
      channel,
      indice_fila
    } = options.messageBroker

    const {
      rota,
      response
    } = options.workerInformation.execucao

    const { agendamento_id_agendamento, tamanho_fila, tamanho_grupo } = options.workerInformation.taskGroupElement

    const { queueName } = options.workerInformation.workerData

    if (message) {
      const api = new Api()
      api.connect(process.env.ENVIRONMENT)
        .token({ appSecret: process.env.APP_SECRET, appKey: process.env.APP_KEY })
        .system('tools')
      const agendamentoExecucao = new AgendamentoExecucao(api)
      const updated = await agendamentoExecucao.updateBy({
        where: { checksum },
        params: {
          data_final: new Moment().dateTime(),
          resposta: response,
          rota,
          fila: '0'
        }
      })
      if (updated) {
        await channel.ack(message)
        const queue = await channel.assertQueue(queueName)
        console.info(`Posição na fila: ${message.fields.deliveryTag}`)
        console.info(`Tamanho da fila: ${tamanho_fila - message.fields.deliveryTag}`)
        console.info(`Tamanho do grupo: ${tamanho_grupo - indice_fila}`)
        console.info(`Indice: ${indice_fila}`)
        if (tamanho_fila - message.fields.deliveryTag === 0) {
          console.info('Processamento concluido')
          const agendamento = new Agendamento(api)
          return await agendamento.updateBy({
            where: { id: agendamento_id_agendamento },
            params: {
              data_ultima_execucao: new Moment().dateTime(),
              processando: '0'
            }
          })
        }
      }
    }
  }

  removeInvalidMessagesOfQueue = async (options) => {
    const {
      message,
      checksum,
      channel,
      indice_fila
    } = options.messageBroker

    const {
      rota,
      response
    } = options.workerInformation.execucao

    const { agendamento_id_agendamento, tamanho_grupo } = options.workerInformation.taskGroupElement

    const { queueName } = options.workerInformation.workerData

    if (message) {
      const api = new Api()
      api.connect(process.env.ENVIRONMENT)
        .token({ appSecret: process.env.APP_SECRET, appKey: process.env.APP_KEY })
        .system('tools')
      const agendamentoExecucao = new AgendamentoExecucao(api)
      const updated = await agendamentoExecucao.updateBy({
        where: { checksum },
        params: {
          data_final: new Moment().dateTime(),
          resposta: response,
          rota,
          fila: '0'
        }
      })
      if (updated) {
        await channel.reject(message, false)
        const queue = await channel.assertQueue(queueName)
        const tamanho_fila = queue.messageCount + queue.consumerCount
        console.info(`Posição na fila: ${message.fields.deliveryTag}`)
        console.info(`Tamanho da fila: ${tamanho_fila - message.fields.deliveryTag}`)
        console.info(`Tamanho do grupo: ${tamanho_grupo - message.fields.deliveryTag}`)
        console.info(`Indice: ${indice_fila + 1}`)
        if (tamanho_fila - message.fields.deliveryTag === 0) {
          console.info('Processamento concluido')
          const agendamento = new Agendamento(api)
          return await agendamento.updateBy({
            where: { id: agendamento_id_agendamento },
            params: {
              data_ultima_execucao: new Moment().dateTime(),
              processando: '0'
            }
          })
        }
      }
    }
  }
}
