import { Moment } from '#tools/moment'
import { DocumentError } from '#domain/errors'
export * from './xml.js'
export * from './xml-nfse.js'
export * from './xml-nfe.js'
export * from './xml-cte.js'
export * from './xml-cfe.js'


export class Documentos {
  competencia = (competencia) => {
    if (new Moment(competencia).isValid()) return competencia
    if (competencia === undefined || competencia === null || !competencia) throw new DocumentError(new Error('Competência inválida'))
    switch (competencia) {
      case 'anterior':
        competencia = new Moment(competencia).subtract(1, 'month').firstDayOf('month').format('YYYY-MM-DD')
        break
      case 'posterior':
        competencia = new Moment(competencia).add(1, 'month').firstDayOf('month').format('YYYY-MM-DD')
        break
      case 'atual':
        competencia = new Moment(competencia).add(1, 'month').firstDayOf('month').format('YYYY-MM-DD')
        break
      default:
        competencia = new Moment(competencia).firstDayOfMonth().format('YYYY-MM-DD')
    }
    return competencia
  }
}
