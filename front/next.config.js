const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enable: process.env.ANALYZE === "true"
});
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  distDir: ".next", // dis디렉토리
  webpack(config) {
    // console.log("config", config); // default webpack setting - resolve
    // console.log("rules", config.module.rules[0]);

    config.module.rules.push(
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              fallback: "file-loader",
              name: "fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|ico)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              fallback: "file-loader",
              name: "images/[name].[ext]"
            }
          }
        ]
      }
    );
    const prod = process.env.NODE_ENV === "production";
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\ko$/)
      //moment tree shaking
    ];
    if (prod) {
      plugins.push(new CompressionPlugin());
      // page compressing
    }
    return {
      ...config,
      mode: prod ? "production" : "development", // 배포환경
      devtool: prod ? "hidden-source-map" : "eval",
      plugins
    };
  }
};
