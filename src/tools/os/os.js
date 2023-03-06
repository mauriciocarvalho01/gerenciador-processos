import os from 'os'

export class Os {
  countCpus = () => {
    return os.cpus().length
  }
}
