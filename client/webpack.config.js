const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
  }),
];

let mode = "development";
let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  target = "browserslist";
}

if (process.env.START) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode: mode,
  target: target,
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
  },
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash]][ext][query]",
  },
  plugins: plugins,
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        // Set limit for inline
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 30 * 1024, // 30kb
        //   },
        // },
      },
    ],
  },

  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "/dist"),
    },
    historyApiFallback: true,
    hot: true,
    compress: true,
    port: 9090,
  },
};
