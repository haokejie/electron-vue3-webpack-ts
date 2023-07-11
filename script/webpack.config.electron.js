const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = (mode) => {
  return {
    stats: {
      logging: 'none'
    },
    mode,
    entry: {
      main: './electron/main.ts',
      preload: './electron/preload.ts'
    },
    target: 'electron-main',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, '..', 'electron'),
            to: path.join(__dirname, '..', 'dist', 'electron'),
            globOptions: {
              // 屏蔽掉ts文件
              ignore: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']
            }
          }
        ]
      })
    ],
    output: {
      path: path.resolve(__dirname, '..', 'dist', 'electron'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.node']
    },
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    }
  }
}
