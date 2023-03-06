/* eslint-disable camelcase */
// Libs
import lodash from 'lodash'
import { parentPort, workerData, threadId } from 'worker_threads'
import { WorkerReportError } from '#application/errors'
import { SiegApiHelper, TokenExterno, Api, Dfe } from '#infra/gateways'
import { ExtractXml } from '#departments/documents'
import { Moment } from '#tools/datetime'
import { Empresa } from '#domain/empresa'

const companyGroupFactory = async (messages) => {
  return lodash.chain(messages)
    .groupBy('content.message_content.cliente.clientes_id_clientes')
    .map(async (processos, cliente_id_cliente) => {
      const { content,queueLength } = processos[0]
      const { message_content } = content
      const { processo, grupo_processos, cliente, agendamento } = message_content
      return {
        token_token_secret: cliente.token_token_secret,
        token_token_key: cliente.token_token_key,
        clientes_id_clientes: cliente_id_cliente,
        processos_nome: processo.processos_nome,
        processos_tipo: processo.processos_tipo,
        processos_processo: processo.processos_processo,
        agendamento_id_agendamento: agendamento.agendamento_id_agendamento,
        processos,
        grupo_processos_config: JSON.parse(grupo_processos.grupo_processos_config),
        tamanho_fila: queueLength,
        tamanho_grupo: processos.length
      }
    }).value()
}

const initTask = async ({ messageBroker }, callback) => {
  console.log(`Tarefa[${workerData.processName}][${threadId}] iniciado em: ${workerData.processPath}`)
  const groupsFactory = await companyGroupFactory(messageBroker.messages)
  console.info(`Total de grupos a serem processados: ${groupsFactory.length}`)
  for (const taskGroups of groupsFactory) {
    if (Array.isArray(taskGroups)) {
      console.info(`Total de items por grupos a serem processados: ${taskGroups.length}`)
      for (const taskGroupElement of taskGroups) {
        if (await taskGroupElement !== undefined) {
          // eslint-disable-next-line n/no-callback-literal
          await execute({
            messageBroker,
            managerInformation: workerData,
            workerInformation: { taskGroupElement: await taskGroupElement, workerData }
          },
            (resultTask) => callback(resultTask)
          )
        }
      }
    } else {
      // eslint-disable-next-line n/no-callback-literal
      await execute(
        {
          messageBroker,
          managerInformation: workerData,
          workerInformation: { taskGroupElement: await taskGroups, workerData }
        },
        (resultTask) => callback(resultTask)
      )
    }
  }
}

const execute = async (options, callback) => {
  try {
    const { workerInformation } = options
    const { grupo_processos_config, processos } = workerInformation.taskGroupElement
    const api = new Api()
    api.connect(process.env.ENVIRONMENT).token({ appSecret: process.env.APP_SECRET, appKey: process.env.APP_KEY }).system('dfe')
    const tokenExterno = new TokenExterno(api)
    const token = await tokenExterno.findOne(
      {
        pagina: 1,
        andWhere: [
          { chave: 'token-externo_tipo', valor: 'api' },
          { chave: 'token-externo_provedor', valor: 'sieg' }
        ]
      })
    const { token_externo_url, token_externo_token_key, token_externo_token_secret } = token
    const siegApiHelper = new SiegApiHelper(token_externo_url)
    siegApiHelper.token({ apikey: token_externo_token_key, email: token_externo_token_secret })
    for (const [index, processoDados] of processos.entries()) {
      const { content, buffer } = processoDados
      const { terceiro, checksum } = content.message_content
      options.workerInformation.execucao = {}
      options.workerInformation.execucao.siegApiHelper = siegApiHelper
      options.workerInformation.execucao.pagina = 0

      if (options.messageBroker.inQueue) {
        options.messageBroker.rejectMessage = false
        options.messageBroker.ackMessage = false
        options.messageBroker.indice_fila = index + 1
        options.messageBroker.message = buffer
        options.messageBroker.checksum = checksum
      }


      const empresa = new Empresa().id(terceiro.terceiros_id_terceiros).cnpj(terceiro.terceiros_inscricao).validaDados()
      if (empresa) {
        console.log(`---------------------------- PROCESSANDO EMPRESA ${empresa.cnpj} -----------------------------------------`)
        console.info('Processo autorizado')
        console.log(`CNPJ:: ${empresa.cnpj}`)
        options.workerInformation.execucao.competencia = new Moment().currentCompetence(grupo_processos_config.competencia)
        options.workerInformation.execucao.empresa = empresa
        if (await consultAndSave(options)) options.messageBroker.ackMessage = true
      } else {
        console.warn(`Existem dados inválidos no processo:  ${JSON.stringify(checksum)}`)
        options.messageBroker.rejectMessage = true
      }
      callback(options)
    }
  } catch (error) {
    console.log(error)
  }
}

const consultAndSave = async (options) => {
  const { workerInformation } = options
  const { execucao } = workerInformation
  const { siegApiHelper, empresa, competencia } = execucao
  console.log(`Paginação Sieg: ${options.workerInformation.execucao.pagina}`)
  console.log(`Competencia: ${JSON.stringify({ dataInicio: competencia, dataFim: new Moment(competencia).lastDayOfMonth() })}`)
  const apiBody = siegApiHelper.competencia({ dataInicio: competencia, dataFim: new Moment(competencia).lastDayOfMonth() })
    .cnpjDestino(empresa.cnpj)
    .tipoXml('cfe')
    .paginacao({ take: 50, skip: options.workerInformation.execucao.pagina })
    .download(false)
    .getBody()
  const { data } = await siegApiHelper.consumeApi(apiBody)
  if (!data) throw new WorkerReportError(new Error('Erro ao buscar notas no Sieg!!'))
  const { xmls } = data
  if (xmls !== undefined) {
    console.log(`Quantide de notas encontradas: ${xmls.length} `)
    const api = new Api()
    api.connect(process.env.ENVIRONMENT)
      .token({ appSecret: process.env.APP_SECRET, appKey: process.env.APP_KEY })
      .system('dfe')
    for (const xmlBase64 of xmls) {
      const xmlBuffer = Buffer.from(xmlBase64, 'base64')
      const xml = xmlBuffer.toString('utf8')
      const extractXml = new ExtractXml({ mtdDownload: 'api', xml })
      const dfe = new Dfe(api)
      options.workerInformation.execucao.rota = api.factoryApiUrl()
      const saved = await dfe.create({ params: await extractXml.extract('cfe') })
      options.workerInformation.execucao.response = saved
      if (!saved) return false
    }
    if (xmls.length === 0) return true
    ++options.workerInformation.execucao.pagina
    return await consultAndSave(options)
  }
}

// Recebe as MessageChannels do processo principal
parentPort.once('message', ({ managerPort, ackMessagePort, rejectMessagePort }) => {
  // Registra um callback para receber mensagens do processo principal através do parentPort1
  managerPort.on('message', async ({ messageBroker }) => {
    console.log(`Mensagem recebida do processo principal: ${messageBroker}`)
    await initTask({ messageBroker }, (resultTask) => {
      if (resultTask.messageBroker.ackMessage) ackMessagePort.postMessage(resultTask)
      if (resultTask.messageBroker.rejectMessage) rejectMessagePort.postMessage(resultTask)
    })
  })
})
