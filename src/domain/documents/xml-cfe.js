import { Xml } from '#domain/documents'
import { XmlFieldError } from '#domain/errors'
import { Moment } from '#tools/datetime'

export class XmlCfe extends Xml {
  constructor ({ xml, externalHelpers }) {
    super({ xml, externalHelpers })
    this.objectExtractor = externalHelpers.lodash
    this.gzip = externalHelpers.zlib
    this.currentXml = xml
    this.objectXml = this.convertToJson()
    this.xmlInfo = {}
  }

  getKey = (object, key) => {
    return this.objectExtractor.get(object, key)
  }

  inscricaoEmitente = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'CFe.infCFe.emit.CNPJ._text') ??
      await this.getKey(this.objectXml, 'CFe.infCFe.emit.CPF._text')
    this.xmlInfo.inscricao_emitente = ''
    if (CNPJCPF) {
      console.log('Inscricao Emitente: ', CNPJCPF)
      this.xmlInfo.inscricao_emitente = CNPJCPF
    }
    return this
  }

  nomeEmitente = async () => {
    const nomeEmit = await this.getKey(this.objectXml, 'CFe.infCFe.emit.xNome._text')
    this.xmlInfo.nome_emitente = ''
    if (nomeEmit) {
      console.log('Nome Emitente: ', nomeEmit)
      this.xmlInfo.nome_emitente = nomeEmit
    }
    return this
  }

  inscricaoDestinatario = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'CFe.infCFe.dest.CNPJ._text') ??
      await this.getKey(this.objectXml, 'CFe.infCFe.dest.CPF._text')
    this.xmlInfo.inscricao_destinatario = ''
    if (CNPJCPF) {
      console.log('Inscricao Destinatario: ', CNPJCPF)
      this.xmlInfo.inscricao_destinatario = CNPJCPF
    }
    return this
  }

  nomeDestinatario = async () => {
    const destxNome = await this.getKey(this.objectXml, 'CFe.infCFe.dest.xNome._text')
    this.xmlInfo.nome_destinatario = ''
    if (destxNome) {
      console.log('Nome Destinatario: ', destxNome)
      this.xmlInfo.nome_destinatario = destxNome
    }
    return this
  }

  numeroCfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'CFe.infCFe.ide.nCFe._text')
    if (!nNF) throw new XmlFieldError(new Error('Não encontrado número da nota'))
    this.xmlInfo.documento = nNF
    return this
  }

  modeloDfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'CFe.infCFe.ide.mod._text')
    if (!nNF) throw new XmlFieldError(new Error('Não encontrado modelo Dfe'))
    this.xmlInfo.modelo_dfe = nNF
  }

  dataEmissao = async () => {
    const dhEmi = await this.getKey(this.objectXml, 'CFe.infCFe.ide.dEmi._text')
    if (!dhEmi) throw new XmlFieldError(new Error('Não encontrado data de emissão'))
    this.xmlInfo.data_emissao =  new Moment(dhEmi).dateTime()
    return this
  }

  valorDfe = async () => {
    const vCfe = await this.getKey(this.objectXml, 'CFe.infCFe.total.vCFe._text')
    if (!vCfe) throw new XmlFieldError(new Error('Não encontrado valor da nota'))
    this.xmlInfo.valor_dfe = vCfe
    return this
  }

  chave = async () => {
    const id = await this.getKey(this.objectXml, 'CFe.infCFe._attributes.Id')
    if (!id) throw new XmlFieldError(new Error('Não encontrado chave da nota'))
    this.xmlInfo.chave = id.split('CFe')[1]
    return this
  }

  mtdDownload = async (mtdDownload) => {
    if (!mtdDownload) throw new XmlFieldError(new Error('Não encontrado mtd_download'))
    this.xmlInfo.mtd_download = mtdDownload
    return this
  }

  arquivo = async () => {
    if (!this.currentXml) throw new XmlFieldError(new Error('Não encontrado xml'))
    this.xmlInfo.tipo_arq = 'xml'
    const xmlZiped = this.gzip.gzipSync(this.currentXml)
    this.xmlInfo.arquivo = xmlZiped.toString('base64')
    return this
  }

  info () {
    return this.xmlInfo
  }
}
