import { Xml } from '#domain/documents'
import { XmlFieldError } from '#domain/errors'
import { Moment } from '#tools/moment'

export class XmlNfse extends Xml {
  constructor({ xml, externalHelpers }) {
    super({ xml, externalHelpers })
    this.gzip = externalHelpers.zlib
    this.currentXml = xml
    this.objectXml = this.convertToJson()
    this.xmlInfo = {}
  }

  inscricaoPrestador = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:IdentificacaoPrestador.ns3:Cnpj._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.IdentificacaoPrestador.Cnpj._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.CPFCNPJPrestador.CNPJ._text')
    this.xmlInfo.inscricao_prestador = ''
    if (CNPJCPF) {
      console.log('Inscricao Prestador: ', CNPJCPF)
      this.xmlInfo.inscricao_prestador = CNPJCPF
    }
    return this
  }

  inscricaoMunicipalPrestador = async () => {
    const ccmPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:IdentificacaoPrestador.ns3:InscricaoMunicipal._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.IdentificacaoPrestador.InscricaoMunicipal._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ChaveNFe.InscricaoPrestador._text')
    this.xmlInfo.inscricao_municipal_prestador = ''
    if (ccmPREST) {
      console.log('Inscricao Municipal Prestador: ', ccmPREST)
      this.xmlInfo.inscricao_municipal_prestador = ccmPREST
    }
    return this
  }

  codigoMunicipalPrestador = async () => {
    const codMunPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:MunicipioPrestacaoServico._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.CodigoMunicipio._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.MunicipioPrestacao._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.Cidade._text')
    //if (!codMunPREST) throw new XmlFieldError(new Error('Não encontrado codigo municipio do prestador'))
    console.log('Código Municipal Prestador: ', codMunPREST)
    this.xmlInfo.cod_municipal_prestador = codMunPREST
    return this
  }

  enderecoPrestador = async () => {
    const endPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:Endereco.ns3:Endereco._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.Endereco._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.Logradouro._text')
    // if (!endPREST) throw new XmlFieldError(new Error('Não encontrado endereço prestador'))
    console.log('Endereço Prestador: ', endPREST)
    this.xmlInfo.endereco_prestador = endPREST
    return this
  }

  numeroEnderecoPrestador = async () => {
    const numEndPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:Endereco.ns3:Numero._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.Numero._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.NumeroEndereco._text')
    this.xmlInfo.numero_endereco_prestador = ''
    if (numEndPREST) {
      console.log('Número Endereço Prestador: ', numEndPREST)
      this.xmlInfo.numero_endereco_prestador = numEndPREST
    }
    return this
  }

  bairroPrestador = async () => {
    const bairroPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:Endereco.ns3:Bairro._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.Bairro._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.Bairro._text')
    this.xmlInfo.bairro_prestador = 'Não informado'
    if (bairroPREST) {
      console.log('Bairro Prestador: ', bairroPREST)
      this.xmlInfo.bairro_prestador = bairroPREST
    }
    return this
  }

  ufPrestador = async () => {
    const ufPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:Endereco.ns3:Estado._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.Uf._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.UF._text')
    // if (!ufPREST) throw new XmlFieldError(new Error('Não encontrado uf prestador'))
    console.log('Uf Prestador: ', ufPREST)
    this.xmlInfo.uf_prestador = ufPREST
    return this
  }

  cepPrestador = async () => {
    const cepPREST = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:Endereco.ns3:Cep._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.Endereco.Cep._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.CEP._text')
    // if (!cepPREST) throw new XmlFieldError(new Error('Não encontrado cep prestador'))
    console.log('CEP Prestador: ', cepPREST)
    this.xmlInfo.cep_prestador = cepPREST
    return this
  }

  razaoPrestador = async () => {
    const razaoPrestador = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:PrestadorServico.ns3:RazaoSocial._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.PrestadorServico.RazaoSocial._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.RazaoSocialPrestador._text')
    //if (!razaoPrestador) throw new XmlFieldError(new Error('Não encontrado razao social prestador'))
    console.log('Razao Social Prestador: ', razaoPrestador)
    this.xmlInfo.razao_prestador = razaoPrestador
    return this
  }

  razaoTomador = async () => {
    const razaoTomador = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:RazaoSocial._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.RazaoSocial._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.RazaoSocialTomador._text ')
    this.xmlInfo.razao_tomador = ''
    if (razaoTomador) {
      console.log('Razao Social Tomador: ', razaoTomador)
      this.xmlInfo.razao_tomador = razaoTomador
    }
    return this
  }

  inscricaoTomador = async () => {
    const CNPJCPF = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:IdentificacaoTomador.ns3:CpfCnpj.ns3:Cnpj._text') ??
      await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:IdentificacaoTomador.ns3:CpfCnpj.ns3:Cpf._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cnpj._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.IdentificacaoTomador.CpfCnpj.Cpf._text') ??
      await this.getKey(this.objectXml, '.RetornoConsulta.NFe.CPFCNPJTomador.CNPJ._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.CPFCNPJTomador.CPF._text')
    this.xmlInfo.inscricao_tomador = '000000000000000'
    if (CNPJCPF) {
      console.log('Inscricao Tomador: ', CNPJCPF)
      this.xmlInfo.inscricao_tomador = CNPJCPF
    }
    return this
  }

  inscricaoMunicipalTomador = async () => {
    const inscMunTOM = await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.IdentificacaoTomador.InscricaoMunicipal._text')
    this.xmlInfo.inscricao_municipal_tomador = '000000000'
    if (inscMunTOM) {
      console.log('Inscricao Municipal Tomador: ', inscMunTOM)
      this.xmlInfo.inscricao_municipal_tomador = inscMunTOM
    }
    return this
  }

  codigoMunicipalTomador = async () => {
    const codMunTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Cidade._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.Cidade._text')
    this.xmlInfo.cod_municipal_tomador = '0'
    if (codMunTOM) {
      console.log('Codigo Municipal Tomador: ', codMunTOM)
      this.xmlInfo.cod_municipal_tomador = codMunTOM
    }
    return this
  }

  enderecoTomador = async () => {
    const endTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Endereco._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.Endereco._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.Logradouro._text')
    this.xmlInfo.endereco_tomador = 'Não informado'
    if (endTOM) {
      console.log('Endereço Tomador: ', endTOM)
      this.xmlInfo.endereco_tomador = endTOM
    }
    return this
  }

  numeroEnderecoTomador = async () => {
    const endTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Numero._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.Numero._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.NumeroEndereco._text')
    this.xmlInfo.numero_endereco_tomador = '0'
    if (endTOM) {
      console.log('Endereço Número Tomador: ', endTOM)
      this.xmlInfo.numero_endereco_tomador = endTOM
    }
    return this
  }

  bairroTomador = async () => {
    const endTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Bairo._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.Bairro._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.Bairro._text')
    this.xmlInfo.bairro_tomador = 'Não informado'
    if (endTOM) {
      console.log('Bairro Tomador: ', endTOM)
      this.xmlInfo.bairro_tomador = endTOM
    }
    return this
  }

  ufTomador = async () => {
    const endTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Estado._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.Uf._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.UF._text')
    this.xmlInfo.uf_tomador = ''
    if (endTOM) {
      console.log('Uf Tomador: ', endTOM)
      this.xmlInfo.uf_tomador = endTOM
    }
    return this
  }

  cepTomador = async () => {
    const endTOM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:TomadorServico.ns3:Endereco.ns3:Cep._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.Cep._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoTomador.CEP._text')
    this.xmlInfo.cep_tomador = '000000'
    if (endTOM) {
      console.log('Cep Tomador: ', endTOM)
      this.xmlInfo.cep_tomador = endTOM
    }
    return this
  }

  valorServico = async () => {
    const valorSERV = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorServicos._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorServicos._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorServicos._text')
    this.xmlInfo.valor_servico = 0
    if (valorSERV) {
      this.xmlInfo.valor_servico = parseFloat(valorSERV)
    }
    return this
  }

  codigoVerificacao = async () => {
    const codiVER = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:IdentificacaoNfse.ns3:CodigoVerificacao._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.CodigoVerificacao._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ChaveNFe.CodigoVerificacao._text')
    // if (!codiVER) throw new XmlFieldError(new Error('Não encontrado valor do serviço'))
    this.xmlInfo.codigo_verificacao = codiVER.toString()
    return this
  }

  statusNfse = async () => {
    const statusNFSE = await this.getKey(this.objectXml, 'RetornoConsulta.NFe.StatusNFe._text')
    this.xmlInfo.status_nfse = 0
    if (statusNFSE) {
      this.xmlInfo.status_nfse = statusNFSE === 'C' ? 1 : 0
    }
    return this
  }

  opcaoSimples = async () => {
    const opcaoSIM = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:OptanteSimplesNacional._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.OptanteSimplesNacional._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.OpcaoSimples._text')
    this.xmlInfo.opcao_simples = 0
    if (opcaoSIM) {
      console.log('Optante Simples', opcaoSIM)
      this.xmlInfo.opcao_simples = parseInt(opcaoSIM)
    }
    return this
  }

  valorDeducao = async () => {
    const valorDED = 0
    // if (!valorDED) throw new XmlFieldError(new Error('Não encontrado valor dedução'))
    this.xmlInfo.valor_deducao = valorDED
    return this
  }

  issRetido = async () => {
    const issRET = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:IssRetido._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.IssRetido._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ISSRetido._text')
    // if (!issRET) throw new XmlFieldError(new Error('Não encontrado iss retido'))
    this.xmlInfo.iss_retido = issRET === 'true' || parseInt(issRET) === 1 ? 1 : 0
    return this
  }

  baseCalculo = async () => {
    const baseCALC = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:BaseCalculo._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.BaseCalculo._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorServicos._text')
    this.xmlInfo.base_calculo = 0
    if (baseCALC) {
      this.xmlInfo.base_calculo = parseFloat(baseCALC)
    }
    return this
  }

  aliquotaServicos = async () => {
    const aliquotaSERV = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:Aliquota._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.Aliquota._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.AliquotaServicos._text')
    this.xmlInfo.aliquota = 0
    if (aliquotaSERV) {
      this.xmlInfo.aliquota = parseFloat(aliquotaSERV)
    }
    return this
  }

  valorLiquido = async () => {
    const valorLIQ = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorLiquidoNfse._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorLiquidoNfse._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorServicos._text')
    this.xmlInfo.valor_liquido = 0
    if (valorLIQ) {
      this.xmlInfo.valor_liquido = parseFloat(valorLIQ)
    }
    return this
  }

  codigoTributacao = async () => {
    const codTrib = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:ItemListaServico._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.CodigoTributacaoMunicipio._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.CodigoServico._text')
    this.xmlInfo.cod_tributacao = 0
    if (codTrib) {
      this.xmlInfo.cod_tributacao = codTrib
    }
    return this
  }

  detalheDescricao = async () => {
    const detDesc = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Discriminacao._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Discriminacao._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.Discriminacao._text')
    // if (!detDesc) throw new XmlFieldError(new Error('Não encontrado detalhe descricao'))
    this.xmlInfo.detalhe_descricao = detDesc
    return this
  }

  codigoMunicipalServico = async () => {
    const codMunServ = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:MunicipioPrestacaoServico._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.TomadorServico.Endereco.CodigoMunicipio._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.EnderecoPrestador.Cidade._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.MunicipioPrestacao._text')
    this.xmlInfo.cod_municipal_servico = ''
    if (codMunServ) {
      console.log('Codigo Municipal Servico: ', codMunServ)
      this.xmlInfo.cod_municipal_servico = codMunServ
    }
    return this
  }

  valorInss = async () => {
    const valorINSS = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorInss._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorINSS._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorINSS._text')
    this.xmlInfo.valor_inss = 0
    if (valorINSS) {
      console.log('Valor Inss: ', valorINSS)
      this.xmlInfo.valor_inss = parseFloat(valorINSS)
    }
    return this
  }

  valorIrrf = async () => {
    const valorIRRF = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorIr._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorIRRF._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorIRRF._text')
    this.xmlInfo.valor_ir = 0
    if (valorIRRF) {
      console.log('Valor Irrf: ', valorIRRF)
      this.xmlInfo.valor_ir = parseFloat(valorIRRF)
    }
    return this
  }

  valorPis = async () => {
    const valorPIS = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorPis._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorPIS._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorPIS._text')
    this.xmlInfo.valor_pis = 0
    if (valorPIS) {
      console.log('Valor Pis: ', valorPIS)
      this.xmlInfo.valor_pis = parseFloat(valorPIS)
    }
    return this
  }

  valorCofins = async () => {
    const ValorCOFINS = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorCOFINS._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorCOFINS._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorCOFINS._text')
    this.xmlInfo.valor_cofins = 0
    if (ValorCOFINS) {
      console.log('Valor Cofins: ', ValorCOFINS)
      this.xmlInfo.valor_cofins = parseFloat(ValorCOFINS)
    }
    return this
  }

  valorCsll = async () => {
    const valorCSLL = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorCSLL._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorCSLL._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorCSLL._text')
    this.xmlInfo.valor_csll = 0
    if (valorCSLL) {
      console.log('Valor Csll: ', valorCSLL)
      this.xmlInfo.valor_csll = parseFloat(valorCSLL)
    }
    return this
  }

  valorIss = async () => {
    const valorISS = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Servico.ns3:Valores.ns3:ValorIss._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Servico.Valores.ValorISS._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ValorISS._text')
    this.xmlInfo.valor_iss = 0
    if (valorISS) {
      console.log('Valor Iss: ', valorISS)
      this.xmlInfo.valor_iss = parseFloat(valorISS)
    }
    return this
  }

  numeroNfe = async () => {
    const nNF = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:IdentificacaoNfse.ns3:Numero._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Numero._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.ChaveNFe.NumeroNFe._text')
    // if (!nNF) throw new XmlFieldError(new Error('Não encontrado número da nota'))
    console.log('Número da Nota: ', nNF)
    this.xmlInfo.documento = nNF
    return this
  }

  dataEmissao = async () => {
    const dhEmi = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:DataEmissao._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.DataEmissao._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.DataEmissaoNFe._text')
    // if (!dhEmi) throw new XmlFieldError(new Error('Não encontrado data de emissão'))
    console.log('Data emissão: ', new Moment(dhEmi).now().format('YYYY-MM-DD'))
    this.xmlInfo.data_emissao = new Moment(dhEmi).now().format('YYYY-MM-DD')
    return this
  }

  competenciaEmissao = async () => {
    const comEmi = await this.getKey(this.objectXml, 'ns2:NFSE.ns2:Nfse.ns3:Competencia._text') ??
      await this.getKey(this.objectXml, 'ConsultarNfseResposta.ListaNfse.CompNfse.Nfse.InfNfse.Competencia._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.DataEmissaoRPS._text') ??
      await this.getKey(this.objectXml, 'RetornoConsulta.NFe.DataEmissaoNFe._text')
    // if (!comEmi) throw new XmlFieldError(new Error('Não encontrado data de emissão'))
    console.log('Competência emissão: ', new Moment(comEmi).firstDayOfMonth().format('YYYY-MM-DD'))
    this.xmlInfo.comp_emissao = new Moment(comEmi).firstDayOfMonth().format('YYYY-MM-DD')
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

  info = () => {
    return this.xmlInfo
  }
}
