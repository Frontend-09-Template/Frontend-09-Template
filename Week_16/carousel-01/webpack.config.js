

module.exports = {
  entry: {
    main: "./main.js", 
    animationDemo: "./animation-demo.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-react-jsx", {"pragma": "createElement"}]],
          }
        }
      }
    ]
  },
  mode: "development",
  devServer: {
    open: true,
    progress: true,
    port: 8080,
    contentBase: './dist'
  }
};