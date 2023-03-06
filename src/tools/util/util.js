import crypto from 'crypto'

export class Util {
  createUuid = (string) => {
    const uuidString = this.generateChecksum(string)
    return uuidString
  }

  generateChecksum = (data) => {
    return crypto
      .createHash('md5')
      .update(data, 'utf8')
      .digest('hex')
  }
}
