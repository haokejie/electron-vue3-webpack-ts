const fs = require('fs')

/**
 * @description 使用 fs 模块读取指定文件
 * @param {string} filePath
 */
function readFile (filePath) {
  return new Promise((resolve, reject) => {
    // 读取前先判断文件是否存在
    isExist(filePath)
      .then(() => {
        fs.readFile(filePath, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
      .catch(() => {
        reject(new Error('文件不存在'))
      })
  })
}

// 使用 fs 模块写入指定文件
function writeFile (filePath, data) {
  return new Promise((resolve, reject) => {
    isExist(filePath)
      .then(() => {
        fs.writeFile(filePath, data, (err) => {
          if (err) reject(err)
          resolve()
        })
      })
      .catch(() => {
        reject(new Error('文件不存在'))
      })
  })
}

// 使用 fs 模块删除指定文件
function deleteFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块创建指定文件夹
function createDir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块删除指定文件夹
function deleteDir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.rmdir(dirPath, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块读取指定文件夹
function readDir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  })
}

// 使用 fs 模块重命名指定文件
function renameFile (oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块判断指定路径是否存在
function isExist (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块判断指定路径是否可读
function isReadable (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.R_OK, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块判断指定路径是否可写
function isWritable (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.W_OK, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块判断指定路径是否可执行
function isExecutable (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.X_OK, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

// 使用 fs 模块获取指定文件的信息
/**
 * @param {string} path
 */
function getFileStat (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) reject(err)
      resolve(stats)
    })
  })
}

// 导出模块
module.exports = {
  readFile,
  writeFile,
  deleteFile,
  createDir,
  deleteDir,
  readDir,
  renameFile,
  isExist,
  isReadable,
  isWritable,
  isExecutable,
  getFileStat
}
