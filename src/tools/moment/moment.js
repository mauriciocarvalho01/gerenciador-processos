import moment from 'moment'
export class Moment {
  constructor(momentString) {
    moment.locale('pt-br')
    this.momentString = momentString
  }

  now = () => {
    this.momentString = moment(this.momentString)
    return this
  }

  lastDayOf = (timeUnit) => {
    this.momentString = moment(this.momentString).endOf(timeUnit)
    return this
  }

  firstDayOf = (timeUnit) => {
    this.momentString = moment(this.momentString).startOf(timeUnit)
    return this
  }

  subtract = (value, timeUnit) => {
    this.momentString = moment(this.momentString).subtract(value, timeUnit)
    return this
  }

  add = (value, timeUnit) => {
    this.momentString = moment(this.momentString).add(value, timeUnit)
    return this
  }

  format = (format) => {
    return moment(this.momentString).format(format)
  }

  isValid = () => {
    return moment(this.momentString).isValid()
  }
}
