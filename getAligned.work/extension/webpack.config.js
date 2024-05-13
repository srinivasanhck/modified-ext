
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    ExtensionContent: "./src/entry/ExtensionContent.ts",
    ExtensionBackground: "./src/entry/ExtensionBackground.ts",
    ExtensionInjectedScript: "./src/entry/ExtensionInjectedScript.ts",

    // Pages
    ExtensionPopup: "./src/entry/ExtensionPopup.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  // optimization: {
  //   minimizer: [
  //     new TerserWebpackPlugin({
  //       terserOptions: {
  //         compress: {
  //           pure_funcs: ['console.log'],
  //         },
  //       },
  //     }),
  //   ],
  // },
  plugins: [new CleanWebpackPlugin(), new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "../", "app", "dist"),
        to: path.resolve(__dirname, "dist", "pages", "popup"),
        noErrorOnMissing: true,
      },
      {
        from: path.resolve(__dirname, "src", "manifest.json"),
        to: path.resolve(__dirname, "dist"),
      },
      {
        from: path.resolve(__dirname, "src", "css"),
        to: path.resolve(__dirname, "dist", "css"),
      },
      {
        from: path.resolve(__dirname, "src", "assets"),
        to: path.resolve(__dirname, "dist", "assets"),
      },
    ],
  }), 

],
};