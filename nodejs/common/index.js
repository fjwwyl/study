const fs = require("fs");
const path = require("path");
const vm = require("vm");


class Module {
    constructor(id) {
        this.id = id;
        this.exports = {};
        this.loaded = false;  //是否已经加载
    }

    /**
     * 加载模块
     */
    load() {
        //获取后缀名
        const extname = path.extname(this.id);

        Module.extensions[extname](this);
        this.loaded = true;

    }

    static extensions = {
        '.js': (module) => {
            //读取文件内容
            const content = fs.readFileSync(module.id, "utf8");

            const wrappedCode = `(function (exports, require, module, __filename, __dirname){
              ${content}  
            \n})`;
            //编译执行代码


            /**
             *  vm.runInThisContext
             *  能够访问共享的全局变量
             *  包括process  无法修改
             *  防止模块代码的污染
             * @type {any}
             */

            const compileFn = vm.runInThisContext(wrappedCode, {
                filename: module.id
            })

            const exports = module.exports;
            const dirname = path.dirname(module.id);
            //配置wrappedCode函数的代码
            compileFn.call(exports, exports, myRequire, module, module.id, dirname)
        },
        '.json': (module) => {
            const content = fs.readFileSync(module.id, "utf8");
            module.exports = JSON.parse(content);
        }
    }

    //相对路径转化成绝对路径
    static resolveFilename(filename) {
        let absPath = path.resolve(filename);
        //当前路径是不是存在
        if (!fs.existsSync(absPath)) {
            const extensions = Object.keys(Module.extensions);

            for (const ext of extensions) {
                const fullPath = absPath + ext;
                if (fs.existsSync(fullPath)) {
                    return fullPath;
                }

            }
        }
        return absPath;
    }

    //缓存
    static _cache = {}

}

function myRequire(filename) {
    const absPath = Module.resolveFilename(filename);
    //检查缓存是否存在
    if (Module._cache[absPath]) {
        return Module._cache[absPath].exports;
    }
    const module = new Module(absPath);
    //加载模块
    module.load();
    //缓存
    Module._cache[absPath] = module;

    return module.exports;
}

const math = myRequire("./math");
console.log(math);