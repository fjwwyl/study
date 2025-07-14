// 实现控制台打印当前的版本号
import path from "path"
import fs from "fs"

export default function myPlugins() {
    let version, config;
    return {
        name: "my-vite-plugin",
        configResolved(resolvedConfig) {
            config = resolvedConfig;
            const pkgPath = path.resolve(config.root, "package.json");
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
            version = pkg.version
        },
        buildStart() {
            console.log("当前版本号为 ：" + version)
        },
        transform(code, id) {
            if (id.endsWith("main.js")) {
                console.log(id);
                return "fjw"
            }
        }
    }
}