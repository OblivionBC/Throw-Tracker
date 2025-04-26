module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    "crypto-browserify": require.resolve("crypto-browserify"),
    vm: require.resolve("vm-browserify"),
    process: false,
  };

  return config;
};
