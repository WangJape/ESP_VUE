const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	lintOnSave: false,

	//webpack配置
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			// 为生产环境修改配置...
			return {
				plugins: [
					new CompressionPlugin({
						test: /\.js$|\.html$|\.css/,
						threshold: 10240,
						deleteOriginalAssets: false
					}),
				]
			}
		} else {
			// 为开发环境修改配置...
		}
	}
}
