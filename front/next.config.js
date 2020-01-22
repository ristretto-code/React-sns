const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enable: process.env.ANALYZE === "true"
});
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const withImages = require("next-images");

module.exports = withImages({
  distDir: ".next", // dis디렉토리
  webpack(config) {
    // console.log("config", config); // default webpack setting - resolve
    // console.log("rules", config.module.rules[0]);

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
});
