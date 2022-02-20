const path = require("path");
const {
  override,
  addLessLoader,
  addWebpackAlias,
  overrideDevServer,
  addWebpackPlugin,
  setWebpackPublicPath,
} = require("customize-cra");
const PUBLIC_PATH = process.env.REACT_APP_ENV === "production" ? "/" : "/";
const devServerConfig = () => (config) => {
  console.log('--------log--------', config);
  config.port = 9091
  return {
    ...config,
    open: false,
    port: 9091,
    proxy: {
      "/api": {
        target: "http://localhost:9090/",
        pathRewrite: {
          "^/api": "",
        },
        changeOrigin: true,
        secure: false,
      },
    },
  };
};

module.exports = {
  webpack: override(
    // publicPath
    setWebpackPublicPath(PUBLIC_PATH),
    // less
    addLessLoader(),
    // 别名
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      "_c": path.resolve(__dirname, "src/components"),
    })
  ),
  devServer: overrideDevServer(devServerConfig()),
};
