const CracoLessPlugin = require("craco-less");

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:  process.env.PATH_PROXY,
        pathRewrite: { '^/api': '' },
        changeOrigin: true,    // changes the origin of the host header to the target URL
        secure: false,
      }
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
