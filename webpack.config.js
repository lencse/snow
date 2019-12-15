const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commandLineArgs = require('command-line-args')
const webpackMerge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const CopyPlugin = require('copy-webpack-plugin')

const args = commandLineArgs([
    { name: 'watch', type: Boolean }
])

const devMode = true === args.watch ||
    process.argv.filter(
        (arg) => arg.match(/webpack-dev-server$/)
    ).length > 0

const dirs = {
    dist: 'public',
    views: 'views'
}

const extra = devMode ?
    {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            port: 2019,
            writeToDisk: true
        }
    } : {
        mode: 'production',
        optimization: {
            minimizer: [
                new TerserPlugin()
            ]
        },
        plugins: [
            new OptimizeCssPlugin({
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            })
        ]
    }

const filenames = {
    js: devMode ? '[name].js' : '[name].[hash].js',
    css: devMode ? '[name].css' : '[name].[hash].css',
    cssChunks: devMode ? '[id].css' : '[id].[hash].css'
}

module.exports = webpackMerge(
    {
        entry: {
            main: [
                './build/compile/src/app.js',
                './styles/main.scss'
            ],
            worker: './build/compile/src/worker.js'
        },
        output: {
            filename: filenames.js,
            path: path.resolve(__dirname, dirs.dist)
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: `${dirs.views}/index.ejs`,
                filename: 'index.html',
                inject: 'body'
            }),
            new MiniCssExtractPlugin({
                filename: filenames.css,
                chunkFilename: filenames.cssChunks
            }),
            new CopyPlugin([
                // { from: 'build/compile/src/worker', to: '' },
                // { from: '.netlify', to: '' },
            ])
        ],
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        performance: {
            hints: false
        }
    },
    extra
)