import lodash from 'lodash'
import convert from 'xml-js'
import zlib from 'zlib'
import { XmlNfse, XmlNfe, XmlCte, XmlCfe } from '#domain/documents'
import { XmlExtractReportError } from '#application/errors'

export class ExtractXml {
  constructor({ mtdDownload, xml }) {
    this.xml = xml
    this.mtd_download = mtdDownload
    this.externalHelpers = { convert, lodash, zlib }
  }

  extract(tipo) {
    console.log(`Tipo de XML: ${tipo}`)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let objectXml = null
      switch (tipo) {
        case 'nfse':
          objectXml = new XmlNfse({ xml: this.xml, externalHelpers: this.externalHelpers })
          await objectXml.inscricaoPrestador()
          await objectXml.razaoPrestador()
          await objectXml.inscricaoMunicipalPrestador()
          await objectXml.codigoMunicipalPrestador()
          await objectXml.enderecoPrestador()
          await objectXml.numeroEnderecoPrestador()
          await objectXml.bairroPrestador()
          await objectXml.ufPrestador()
          await objectXml.cepPrestador()
          await objectXml.razaoTomador()
          await objectXml.inscricaoTomador()
          await objectXml.inscricaoMunicipalTomador()
          await objectXml.codigoMunicipalTomador()
          await objectXml.enderecoTomador()
          await objectXml.numeroEnderecoTomador()
          await objectXml.bairroTomador()
          await objectXml.ufTomador()
          await objectXml.cepTomador()
          await objectXml.valorServico()
          await objectXml.valorInss()
          await objectXml.valorIrrf()
          await objectXml.valorPis()
          await objectXml.valorDeducao()
          await objectXml.valorCofins()
          await objectXml.valorIss()
          await objectXml.valorCsll()
          await objectXml.aliquotaServicos()
          await objectXml.baseCalculo()
          await objectXml.valorLiquido()
          await objectXml.codigoTributacao()
          await objectXml.detalheDescricao()
          await objectXml.codigoMunicipalServico()
          await objectXml.statusNfse()
          await objectXml.issRetido()
          await objectXml.opcaoSimples()
          await objectXml.numeroNfe()
          await objectXml.dataEmissao()
          await objectXml.competenciaEmissao()
          await objectXml.codigoVerificacao()
          await objectXml.arquivo()
          await objectXml.mtdDownload(this.mtd_download)
          resolve(objectXml.info())
          break
        case 'nfe':
          objectXml = new XmlNfe({ xml: this.xml, externalHelpers: this.externalHelpers })
          await objectXml.inscricaoEmitente()
          await objectXml.nomeEmitente()
          await objectXml.inscricaoDestinatario()
          await objectXml.nomeDestinatario()
          await objectXml.numeroNfe()
          await objectXml.modeloDfe()
          await objectXml.dataEmissao()
          await objectXml.valorDfe()
          await objectXml.chave()
          await objectXml.arquivo()
          await objectXml.mtdDownload(this.mtd_download)
          resolve(objectXml.info())
          break
        case 'cte':
          objectXml = new XmlCte({ xml: this.xml, externalHelpers: this.externalHelpers })
          await objectXml.inscricaoEmitente()
          await objectXml.nomeEmitente()
          await objectXml.inscricaoDestinatario()
          await objectXml.nomeDestinatario()
          await objectXml.inscricaoRemetente()
          await objectXml.nomeRemetente()
          await objectXml.inscricaoExpedidor()
          await objectXml.nomeExpedidor()
          await objectXml.inscricaoRecebedor()
          await objectXml.nomeRecebedor()
          await objectXml.inscricaoOutros()
          await objectXml.nomeOutros()
          await objectXml.tipoTomador()
          await objectXml.numeroCte()
          await objectXml.modeloDfe()
          await objectXml.dataEmissao()
          await objectXml.valorDfe()
          await objectXml.chave()
          await objectXml.arquivo()
          await objectXml.mtdDownload(this.mtd_download)
          resolve(objectXml.info())
          break
        case 'cfe':
          objectXml = new XmlCfe({ xml: this.xml, externalHelpers: this.externalHelpers })
          await objectXml.inscricaoEmitente()
          await objectXml.nomeEmitente()
          await objectXml.inscricaoDestinatario()
          await objectXml.nomeDestinatario()
          await objectXml.numeroCfe()
          await objectXml.modeloDfe()
          await objectXml.dataEmissao()
          await objectXml.valorDfe()
          await objectXml.chave()
          await objectXml.arquivo()
          await objectXml.mtdDownload(this.mtd_download)
          resolve(objectXml.info())
          break
        default:
          reject(new XmlExtractReportError(new Error('Tipo de xml não foi informado!')))
      }
    })
  }
}
