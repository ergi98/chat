const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let mode = "development";
let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  target="browserslist"
}

module.exports = {
  mode: mode,
  target: target,
  // entry: "./src/index.js",
  // output: {
  //   filename: "bundle.[contenthash].js",
  //   path: path.resolve(__dirname, "dist"),
  // },
  // resolve: {
  //   modules: [__dirname, "src", "node_modules"],
  //   extensions: [".js", ".jsx", ".tsx", ".ts"],
  // },   plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "/dist"),
    },
    hot: true,
    compress: true,
    port: 9090,
  },
};
