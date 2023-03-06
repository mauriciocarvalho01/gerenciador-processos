import fs from 'fs-extra'

export class File {
  fileExists = (path) => {
    return new Promise((resolve) => {
      resolve(fs.existsSync(path))
    })
  }
  readDir = (path, callback) => {
    fs.readdir(path, callback)
  }
}



