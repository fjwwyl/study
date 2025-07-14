// 需求


//打包的文件的文件名都放在fileList.md中


class FileListPlugin {
    constructor(options) {
        this.options = options;
        this.filename = "fileList.md";
    }

    apply(compiler) {
        compiler.hooks.emit.tap("FileListPlugin", (compilation) => {
            const {filename: fileName} = this;

            // 静态资源的名称
            const assets = compilation.assets;
            console.log(assets, fileName);
            let content = "";
            for (let filename in assets) {
                content += `- ${filename}\n`
            }

            compilation.assets[fileName] = {
                source: function () {
                    return content;
                },
                size: function () {
                    return content.length;
                }
            }
        })
    }
}

module.exports = FileListPlugin;