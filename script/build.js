const webpack = require('webpack')
const path = require('path')
const { Command } = require('commander')
const runConfig = require('./run-config.js')
const rendererConfig = require('./webpack.config.render.js')
const electronConfig = require('./webpack.config.electron.js')
const MultiSpinner = require('multispinner')
const { readFile, writeFile } = require('./util.js')
const program = new Command()

// 设置环境变量文件
async function setEnvFile (option) {
  const { mode } = option
  console.log('mode', mode)
  // 读取 config.js 文件
  try {
    const data = await readFile(
      path.join(__dirname, '..', 'electron', 'config.json')
    )
    const config = JSON.parse(data)
    config.MODE_PATH = `.env.${mode}`
    console.log('json后的文件', config)
    await writeFile(
      path.join(__dirname, '..', 'electron', 'config.json'),
      JSON.stringify(config)
    )
  } catch (error) {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
}

async function runBuild (option) {
  await setEnvFile(option)
  const tasks = ['renderer', 'main']
  const m = new MultiSpinner(tasks, {
    preText: 'building',
    postText: 'process'
  })

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log('success')
    // eslint-disable-next-line no-process-exit
    process.exit()
  })
  pack(rendererConfig(option.mode))
    .then((result) => {
      console.log('result', result)
      m.success('renderer')
    })
    .catch((err) => {
      console.log('err', err)
      m.error('renderer')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    })

  pack(electronConfig(option.mode))
    .then((result) => {
      console.log('result', result)
      m.success('main')
    })
    .catch((err) => {
      console.log('err', err)
      m.error('main')
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    })
}

function pack (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)
      } else if (stats.hasErrors()) {
        stats
          .toString({
            chunks: false,
            colors: true
          })
          .split(/\r?\n/)
          .forEach((line) => {
            console.log(line)
          })
        reject(err)
      } else {
        resolve(
          stats.toString({
            chunks: false,
            colors: true
          })
        )
      }
    })
  })
}

program
  .command('build')
  .option('--mode,--mode <value>', '启动环境')
  .option('--port,--port <value>', '启动端口')
  .description('启动electron')
  .action((option) => {
    runBuild(Object.assign({}, runConfig, option))
  })
program.parse()
