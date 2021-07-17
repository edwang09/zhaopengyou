const CopyPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
    port: 80,
    host: "0.0.0.0",
    watchOptions: {
      aggregateTimeout: 500, // delay before reloading
      poll: 1000, // enable polling since fsevents are not supported in docker
    },
  },
  // Bundle '.ts' files as well as '.js' files.
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: `${process.cwd()}/dist`,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./public", to: "" }],
    }),
    // new HtmlWebpackPlugin({
    //   title: "Development",
    // }),
  ],
};
