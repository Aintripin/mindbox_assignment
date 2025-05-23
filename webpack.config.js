const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const portfinder = require("portfinder");

module.exports = async (env, argv) => {
  const isProduction = argv.mode === "production";

  // Find available port starting from 3000
  const port = await portfinder.getPortPromise({
    port: 3000,
    stopPort: 3999,
  });

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "bundle.js",
      publicPath: isProduction ? "/mindbox_assignment/" : "/",
      clean: true, // Clean dist folder before each build
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                [
                  "@babel/preset-typescript",
                  {
                    isTSX: true,
                    allExtensions: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.module\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProduction
                    ? "[hash:base64:8]"
                    : "[name]__[local]--[hash:base64:5]",
                },
                sourceMap: !isProduction,
              },
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                api: "modern",
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                api: "modern",
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : false,
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
              chunkFilename: "[id].[contenthash].css",
            }),
          ]
        : []),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: port,
      hot: true,
      open: true,
    },
    optimization: isProduction
      ? {
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
              },
            },
          },
        }
      : {},
  };
};
