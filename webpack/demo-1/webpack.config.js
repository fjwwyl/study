const path = require("path")
const HtmlWebpackPlugins = require("html-webpack-plugin")
const FileListPlugin = require("./plugins/fileList")

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: "/node_modules",
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: "css-loader"
            },
            {
                test: /\.md$/,
                use: [
                    "html-loader",
                    {
                        loader: path.resolve(__dirname, "loaders", "loaderA")
                    }
                ]
            },

        ]
    },
    plugins: [
        // 如何实现一个html的插件
        new HtmlWebpackPlugins({
            template: path.join(__dirname, "./public/index.html")
        }),
        new FileListPlugin(),
    ],
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
    },
}
