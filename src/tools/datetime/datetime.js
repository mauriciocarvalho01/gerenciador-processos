import moment from 'moment'
export class Moment {
  constructor(momentString) {
    moment.locale('pt-br')
    this.momentString = momentString
  }

  dateTime = () => {
    return moment(this.momentString).format('YYYY-MM-DDTHH:mm:ss')
  }

  date = () => {
    return moment(this.momentString).format('YYYY-MM-DD')
  }

  lastDayOfMonth = () => {
    return moment(this.momentString).endOf('month').format('YYYY-MM-DD')
  }

  firstDayOfMonth = () => {
    return moment(this.momentString).startOf('month').format('YYYY-MM-DD')
  }

  currentCompetence = (competencia) => {
    if (moment(competencia, 'YYYY-DD-MM', true).isValid()) return competencia
    const now = moment(this.momentString).format('YYYY-MM-DD')
    if (competencia === undefined || competencia === null || !competencia) return competencia
    switch (competencia) {
      case 'anterior':
        competencia = moment(moment(now).subtract(1, 'month')).startOf('month').format('YYYY-MM-DD')
        break
      case 'posterior':
        competencia = moment(moment(now).add(1, 'month')).startOf('month').format('YYYY-MM-DD')
        break
      default:
        competencia = moment(now).startOf('month').format('YYYY-MM-DD')
    }
    return competencia
  }
}
