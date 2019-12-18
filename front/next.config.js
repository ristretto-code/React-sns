module.export = {
  distDir: ".next", // dis디렉토리
  webpack(config) {
    console.log(config);
    return config;
  }
};
