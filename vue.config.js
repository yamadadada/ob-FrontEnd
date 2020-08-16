module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://localhost:8081',
        changeOrigin: true
      }
    },
    port: 80
  },
  publicPath: '/'
}