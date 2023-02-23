let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const {
	getThemeColors,
	modifyVars
} = require('./src/utils/themeUtil')
const {resolveCss} = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'
const TerserPlugin = require('terser-webpack-plugin');

const assetsCDN = {
	// webpack build externals
	externals: {},
	css: [],
	js: []
}

module.exports = {
  	lintOnSave: false,
  	devServer: {
  		port: 8090,
  		proxy: {
  			'/api': {
  				target: process.env.VUE_APP_API_BASE_URL,
  				changeOrigin: true,
  				pathRewrite: {
  					'^/api': ''
  				}
  			}
  		},
  		https: false
  	},
  	pluginOptions: {
  		'style-resources-loader': {
  			preProcessor: 'less',
  			patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
  		},
  	},
  	configureWebpack: config => {
  		config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
  		config.performance = {
  			hints: false
  		}
  
      config.plugins.push(
        new ThemeColorReplacer({
          fileName: 'css/theme-colors-[contenthash:8].css',
          matchColors: getThemeColors(),
          injectCss: true,
          resolveCss
        })
      )
  		// Ignore all locale files of moment.js
  		config.plugins.push(new webpack.IgnorePlugin({
  		  resourceRegExp: /^\.\/locale$/,
  		  contextRegExp: /moment$/,
  		}))
  
  		if (isProd) {
  			config.optimization.minimizer = [new TerserPlugin({
  				exclude: /pipy-4lb\.js$/,
  			})];
  		}
  		if (isProd) {
  			// add `CompressionWebpack` plugin to webpack plugins
  			config.plugins.push(new CompressionWebpackPlugin({
  				algorithm: 'gzip',
  				test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  				threshold: 10240,
  				minRatio: 0.8
  			}))
  		}
  		// if prod, add externals
  		if (isProd) {
  			config.externals = assetsCDN.externals
  		}
  	},
  	chainWebpack: config => {
  		if (isProd) {
  			config.plugin('html')
  				.tap(args => {
  					args[0].cdn = assetsCDN
  					return args
  				});
  		}
  	},
  	css: {
  		loaderOptions: {
  			less: {
  				lessOptions: {
  					modifyVars: modifyVars(),
  					javascriptEnabled: true
  				}
  			}
  		}
  	},
  	publicPath: process.env.VUE_APP_PUBLIC_PATH,
  	outputDir: 'dist',
  	assetsDir: 'static',
  	productionSourceMap: false
}
