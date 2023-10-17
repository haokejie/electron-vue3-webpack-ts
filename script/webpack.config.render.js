const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const UnpluginAutoImportPlugin = require('unplugin-auto-import/webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DotenvWebpackPlugin = require('dotenv-webpack')
const webpack = require('webpack')
const path = require('path')

// 改成函数

function resolvePath () {
  return path.resolve(__dirname, '..', ...arguments)
}

module.exports = (mode) => {
  return {
    devtool: 'source-map',
    // 关闭log
    stats: {
      logging: 'none',
      warnings: false,
      errors: false,
      modules: false,
      entrypoints: false,
      children: false,
      assets: false
    },
    mode,
    entry: {
      main: './src/main.ts'
    },
    output: {
      filename: '[name].js',
      path: resolvePath('dist', 'web'),
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.js', '.jsx', '.tsx', '.vue', '.json', '.node'],
      modules: [resolvePath('node_modules')],
      alias: {
        '@': resolvePath('src')
      }
    },
    externals: {
      // 这里添加 electron 的依赖 比如  'nertc-electron-sdk': 'commonjs2 nertc-electron-sdk'
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['main'],
        nodeModules: true
      }),
      new ForkTsCheckerWebpackPlugin(),
      new VueLoaderPlugin(),
      UnpluginAutoImportPlugin({
        imports: ['vue'],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // Default `false`
          filepath: '.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      new DotenvWebpackPlugin({
        // prefix: 'import.meta.env.',
        path: mode ? `./.env.${mode}` : './.env',
        allowEmptyValues: true,
        systemvars: true,
        silent: true
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolvePath('static'),
            to: resolvePath('dist', 'web', 'static'),
            globOptions: {
              ignore: ['.*']
            }
          }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          // 匹配以.css结尾的文件
          test: /\.css$/,
          // 使用css-loader和style-loader去解析
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(less)$/,
          use: ['style-loader', 'css-loader', 'less-loader']
        },
        {
          test: /\.(ts|js|tsx|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.json',
                appendTsSuffixTo: [/\.vue$/],
                appendTsxSuffixTo: [/\.vue$/],
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name]--[hash:8].[ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'media/[name]--[hash8].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name]--[hash8].[ext]'
          }
        }
        // {
        //   test: /\.(png|jpg|gif|jpeg|svg|woff|woff2|eot|ttf|otf)$/,

        // }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 1024,
        maxSize: 30 * 1024,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: 'chunk-common'
          }
        }
      }
    }
  }
}
