import { Xml } from '#domain/documents'
import { XmlFieldError } from '#domain/errors'

export class XmlCte extends Xml {
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
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.emit.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.emit.CPF._text')
    this.xmlInfo.inscricao_emitente = ''
    if (CNPJCPF) {
      console.log('Inscricao Emitente: ', CNPJCPF)
      this.xmlInfo.inscricao_emitente = CNPJCPF
    }
    return this
  }

  nomeEmitente = async () => {
    const nomeEmit = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.emit.xNome._text')
    this.xmlInfo.nome_emitente = ''
    if (nomeEmit) {
      console.log('Nome Emitente: ', nomeEmit)
      this.xmlInfo.nome_emitente = nomeEmit
    }
    return this
  }

  inscricaoDestinatario = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.dest.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.dest.CPF._text')
    this.xmlInfo.inscricao_destinatario = ''
    if (CNPJCPF) {
      console.log('Inscricao Destinatario: ', CNPJCPF)
      this.xmlInfo.inscricao_destinatario = CNPJCPF
    }
    return this
  }

  nomeDestinatario = async () => {
    const destxNome = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.dest.xNome._text')
    this.xmlInfo.nome_destinatario = ''
    if (destxNome) {
      console.log('Nome Destinatario: ', destxNome)
      this.xmlInfo.nome_destinatario = destxNome
    }
    return this
  }

  inscricaoRemetente = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.rem.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.rem.CPF._text')
    this.xmlInfo.inscricao_remetente = ''
    if (CNPJCPF) {
      console.log('Inscricao Remetente: ', CNPJCPF)
      this.xmlInfo.inscricao_remetente = CNPJCPF
    }
    return this
  }

  nomeRemetente = async () => {
    const remxNome = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.rem.xNome._text')
    this.xmlInfo.nome_remetente = ''
    if (remxNome) {
      console.log('Nome Remetente: ', remxNome)
      this.xmlInfo.nome_remetente = remxNome
    }
    return this
  }

  inscricaoExpedidor = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.exped.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.exped.CPF._text')
    this.xmlInfo.inscricao_expedidor = ''
    if (CNPJCPF) {
      console.log('Inscricao Expedidor: ', CNPJCPF)
      this.xmlInfo.inscricao_expedidor = CNPJCPF
    }
    return this
  }

  nomeExpedidor = async () => {
    const expxNome = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.exped.xNome._text')
    this.xmlInfo.nome_expedidor = ''
    if (expxNome) {
      console.log('Nome Expedidor: ', expxNome)
      this.xmlInfo.nome_expedidor = expxNome
    }
    return this
  }

  inscricaoRecebedor = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.receb.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.receb.CPF._text')
    this.xmlInfo.inscricao_recebedor = ''
    if (CNPJCPF) {
      console.log('Inscricao Recebedor: ', CNPJCPF)
      this.xmlInfo.inscricao_recebedor = CNPJCPF
    }
    return this
  }

  nomeRecebedor = async () => {
    const recxNome = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.receb.xNome._text')
    this.xmlInfo.nome_recebedor = ''
    if (recxNome) {
      console.log('Nome Recebedor: ', recxNome)
      this.xmlInfo.nome_recebedor = recxNome
    }
    return this
  }

  inscricaoOutros = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.outros.CNPJ._text') ??
      await this.getKey(this.objectXml, 'cteProc.CTe.infCte.outros.CPF._text')
    this.xmlInfo.inscricao_outros = ''
    if (CNPJCPF) {
      console.log('Inscricao Outros: ', CNPJCPF)
      this.xmlInfo.inscricao_outros = CNPJCPF
    }
    return this
  }

  nomeOutros = async () => {
    const outxNome = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.outros.xNome._text')
    this.xmlInfo.nome_outros = ''
    if (outxNome) {
      console.log('Nome Outros: ', outxNome)
      this.xmlInfo.nome_outros = outxNome
    }
    return this
  }

  tipoTomador = async () => {
    const tipoTom = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.ide.toma3.toma._text')
    console.log('Tipo Tomador: ', tipoTom)
    switch (tipoTom) {
      case '0':
        this.xmlInfo.tomador_responsavel = 'rem'
        break
      case '1':
        this.xmlInfo.tomador_responsavel = 'exped'
        break
      case '2':
        this.xmlInfo.tomador_responsavel = 'receb'
        break
      case '3':
        this.xmlInfo.tomador_responsavel = 'dest'
        break
      default:
        this.xmlInfo.tomador_responsavel = 'outros'
    }

    return this
  }

  numeroCte = async () => {
    const nNF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.ide.nCT._text')
    if (!nNF) throw new XmlFieldError(new Error('Não encontrado número da nota'))
    this.xmlInfo.documento = nNF
    return this
  }

  modeloDfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.ide.mod._text')
    if (!nNF) throw new XmlFieldError(new Error('Não encontrado modelo Dfe'))
    this.xmlInfo.modelo_dfe = nNF
  }

  dataEmissao = async () => {
    const dhEmi = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.ide.dhEmi._text')
    if (!dhEmi) throw new XmlFieldError(new Error('Não encontrado data de emissão'))
    this.xmlInfo.data_emissao = dhEmi
    return this
  }

  valorDfe = async () => {
    const vCte = await this.getKey(this.objectXml, 'cteProc.CTe.infCte.vPrest.vTPrest._text')
    if (!vCte) throw new XmlFieldError(new Error('Não encontrado valor da nota'))
    this.xmlInfo.valor_dfe = vCte
    return this
  }

  chave = async () => {
    const id = await this.getKey(this.objectXml, 'cteProc.CTe.infCte._attributes.Id')
    if (!id) throw new XmlFieldError(new Error('Não encontrado chave da nota'))
    this.xmlInfo.chave = id.split('CTe')[1]
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
