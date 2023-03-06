
export class Xml {
  constructor ({ xml, externalHelpers }) {
    this.xmlConverter = externalHelpers.convert
    this.objectExtractor = externalHelpers.lodash
    this.xml = xml
  }

  getKey = (object, key) => {
    return this.objectExtractor.get(object, key)
  }

  convertToJson () {
    return JSON.parse(this.xmlConverter.xml2json(this.xml, { compact: true, spaces: 4 }))
  }
}
