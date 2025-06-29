module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
    process: require.resolve("process/browser"),
    os: require.resolve("os-browserify/browser"),
  };

  // Add process polyfill
  config.plugins = config.plugins || [];
  const webpack = require("webpack");
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );

  // Suppress source map warnings
  config.ignoreWarnings = [
    { message: /Failed to parse source map/ },
    { message: /Module Warning \(from .*source-map-loader/ },
  ];

  return config;
};
