import { Xml } from '#domain/documents'
import { XmlFieldError } from '#domain/errors'
import { Moment } from '#tools/moment'

export class XmlNfe extends Xml {
  constructor({ xml, externalHelpers }) {
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
    const CNPJCPF = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.emit.CNPJ._text') ??
      await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.emit.CPF._text')
    this.xmlInfo.inscricao_emitente = ''
    if (CNPJCPF) {
      console.log('Inscricao Emitente: ', CNPJCPF)
      this.xmlInfo.inscricao_emitente = CNPJCPF
    }
    return this
  }

  nomeEmitente = async () => {
    const nomeEmit = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.emit.xNome._text')
    this.xmlInfo.nome_emitente = ''
    if (nomeEmit) {
      console.log('Nome Emitente: ', nomeEmit)
      this.xmlInfo.nome_emitente = nomeEmit
    }
    return this
  }

  inscricaoDestinatario = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.dest.CNPJ._text') ??
      await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.dest.CPF._text')
    this.xmlInfo.inscricao_destinatario = ''
    if (CNPJCPF) {
      console.log('Inscricao Destinatario: ', CNPJCPF)
      this.xmlInfo.inscricao_destinatario = CNPJCPF
    }
    return this
  }

  nomeDestinatario = async () => {
    const destxNome = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.dest.xNome._text')
    this.xmlInfo.nome_destinatario = ''
    if (destxNome) {
      console.log('Nome Destinatario: ', destxNome)
      this.xmlInfo.nome_destinatario = destxNome
    }
    return this
  }

  numeroNfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.ide.nNF._text')
    //if (!nNF) throw new XmlFieldError(new Error('Não encontrado número da nota'))
    this.xmlInfo.documento = nNF
    return this
  }

  modeloDfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.ide.mod._text')
    //if (!nNF) throw new XmlFieldError(new Error('Não encontrado modelo Dfe'))
    this.xmlInfo.modelo_dfe = nNF
  }

  dataEmissao = async () => {
    const dhEmi = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.ide.dhEmi._text')
    //if (!dhEmi) throw new XmlFieldError(new Error('Não encontrado data de emissão'))
    console.log('Data emissão: ', new Moment(dhEmi).now().format('YYYY-MM-DDTHH:mm:ss'))
    this.xmlInfo.data_emissao = new Moment(dhEmi).now().format('YYYY-MM-DDTHH:mm:ss')
    return this
  }

  valorDfe = async () => {
    const vNfe = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe.total.ICMSTot.vNF._text')
    //if (!vNfe) throw new XmlFieldError(new Error('Não encontrado valor da nota'))
    this.xmlInfo.valor_dfe = vNfe
    return this
  }

  chave = async () => {
    const id = await this.getKey(this.objectXml, 'nfeProc.NFe.infNFe._attributes.Id')
    //if (!id) throw new XmlFieldError(new Error('Não encontrado chave da nota'))
    this.xmlInfo.chave = id.split('NFe')[1]
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

  info() {
    return this.xmlInfo
  }
}
