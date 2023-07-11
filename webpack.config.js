const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const UnpluginAutoImportPlugin = require('unplugin-auto-import/webpack')
const DotenvWebpackPlugin = require('dotenv-webpack')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // 关闭log
  stats: {
    // logging: 'none',
    // warnings: false,
    // errors: false,
    // modules: false,
    // entrypoints: false,
    // children: false,
    // assets: false
  },
  mode: 'production',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
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
      isBrowser: false,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
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
      path: './.env.production',
      allowEmptyValues: true,
      systemvars: true,
      silent: true
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
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              appendTsxSuffixTo: [/\.vue$/],
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false
            }
          }
        ]
      }
    ]
  }
}
