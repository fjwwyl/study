/**
 * 对外抛出一个方法用来接收用户需要创建文件的项目和参数
 */
//处理文件路径相关的操作，跨平台兼容（Windows/macOS/Linux）。
const path = require("path")
//文件系统操作（读写、删除、监控文件等）。
const fs = require("fs-extra")
//命令行交互式问答工具，收集用户输入。
const inquirer = require("inpuirer")
module.exports = async function (name, options) {
  //判断项目是否存在


  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);

  if (fs.existsSync(targetAir)) {
    //是否为强制创建
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      let {action} = await inquirer.prompt([{
        name: "action",
        type: "list",
        message: "already exists",
        choices: [{
          name: "Overwrite",
          value: "overwrite"
        }, {
          name: "Cancel",
          value: false
        }]
      }])
      if (!action) {
        return;
      } else if (action === "overwrite") {
        await fs.remove(targetAir);
      }
    }
  }


  //新建模板


  const generator = new Generator(name, targetAir)
}