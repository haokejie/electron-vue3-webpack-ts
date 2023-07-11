const webpack = require('webpack')
// const fs = require('fs')
const electron = require('electron')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')
const { spawn } = require('child_process')
const Portfinder = require('portfinder')
const { Command } = require('commander')
const runConfig = require('./run-config.js')
const rendererConfig = require('./webpack.config.render.js')
const electronConfig = require('./webpack.config.electron.js')
const UUID = require('uuid')
const dotenv = require('dotenv')
const { readFile, writeFile } = require('./util.js')

const program = new Command()

const electronProcessMap = new Map()
const rendererProcessMap = new Map()

// 设置环境变量文件
async function setEnvFile (option) {
  const { env } = option
  console.log('mode', env)
  // 读取 config.js 文件
  try {
    const data = await readFile(
      path.join(__dirname, '..', 'electron', 'config.json')
    )
    const config = JSON.parse(data)
    config.MODE_PATH = `.env.${env}`
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

// 判断renderer进程是否初始化完成
function isRendererProcessReady () {
  const rendererWebpack = rendererProcessMap.get('webpack')
  const rendererServer = rendererProcessMap.get('server')
  return rendererWebpack && rendererServer
}

function startRenderer (option) {
  return new Promise((resolve, reject) => {
    const { port, env } = option
    Portfinder.basePort = port
    Portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        console.log('端口号：', port)
        const compiler = webpack(rendererConfig(env))
        compiler.hooks.done.tap('done', (_stats) => {
          console.log('done:renderer')
          rendererProcessMap.set('webpack', true)
          if (isRendererProcessReady()) {
            resolve()
          }
        })
        const server = new WebpackDevServer(
          {
            port,
            hot: true,
            static: {
              directory: path.join(__dirname, '..', 'static'),
              publicPath: '/static/'
            }
          },
          compiler
        )
        server
          .start()
          .then(() => {
            console.log('启动成功')
            rendererProcessMap.set('server', true)
            if (isRendererProcessReady()) {
              resolve()
            }
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  })
}

function startMain (option) {
  return new Promise((resolve, _reject) => {
    const { env } = option
    const compiler = webpack(electronConfig(env))
    compiler.hooks.watchRun.tapAsync('watch-run', (_compilation, done) => {
      console.log('watch-run')
      done()
    })
    compiler.hooks.done.tap('done', (_stats) => {
      console.log('done:main')
      resolve()
    })
    compiler.watch({}, (err, _stats) => {
      if (err) {
        console.log('err', err)
        return
      }
      console.log('stats')
      // 获取当前正在运行的electron进程 status === 'running'
      const runningElectronProcess = Array.from(
        electronProcessMap.values()
      ).filter((processInfo) => processInfo.status === 'running')
      if (runningElectronProcess.length > 0) {
        // 重启electron
        console.log('重启electron')
        runningElectronProcess.forEach((processInfo) => {
          processInfo.process.kill()
          processInfo.exitFn = () => {
            startElectron()
          }
        })
      }
    })
  })
}

function startElectron () {
  const uuid = UUID.v4()
  console.log('uuid', uuid)
  const args = [path.join(__dirname, '..'), '--inspect=5858']
  const electronProcess = spawn(electron, args)
  electronProcess.stdout.on('data', (data) => {
    // data  是一个buffer 需要转换成字符串
    console.log('stdout', data.toString('utf8'))
  })
  electronProcess.stderr.on('data', (data) => {
    console.log('stderr', data.toString('utf8'))
  })

  electronProcess.on('close', (code) => {
    // 获取当前进程的信息
    const processInfo = electronProcessMap.get(uuid)
    if (processInfo) {
      processInfo.status = 'close'
      processInfo.endTime = Date.now()
      processInfo.code = code
      processInfo.process = null
      if (processInfo.exitFn) {
        processInfo.exitFn()
      } else {
        console.log('没有退出回调')
        // eslint-disable-next-line no-process-exit
        process.exit(0)
      }
    } else {
      console.log('没有找到进程信息')
      // eslint-disable-next-line no-process-exit
      process.exit(0)
    }
  })
  electronProcessMap.set(uuid, {
    uuid,
    args,
    startTime: Date.now(),
    status: 'running',
    process: electronProcess,
    // 退出后处理方式
    exitFn: undefined
  })
}

async function runDev (option) {
  const { mode } = option
  try {
    dotenv.config({
      path: `.env.${mode}`
    })
    console.log(process.env.NODE_ENV)
    option.env = process.env.NODE_ENV
    // 设置环境变量文件
    await setEnvFile(option)
    // 启动渲染进程
    await startRenderer(option)
    // 启动webpack 打包electron/main.ts
    console.log('启动webpack 打包electron/main.ts')
    await startMain(option)

    // 启动electron
    startElectron(option)
  } catch (error) {}
  console.log(option)
}

program
  .command('dev')
  .option('--mode,--mode <value>', '启动环境')
  .option('--port,--port <value>', '启动端口')
  .description('启动服务器')
  .action((option) => {
    runDev(Object.assign({}, runConfig, option))
  })

program
  .command('build')
  .option('--mode,--mode <value>', '启动环境')
  .option('--port,--port <value>', '启动端口')
  .description('启动electron')
  .action((option) => {
    runDev(Object.assign({}, runConfig, option))
  })
program.parse()
