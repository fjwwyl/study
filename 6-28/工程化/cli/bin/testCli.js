#! /usr/bin/env node


const program = require("commander")

program
  .command("create <project-name>")
  .description("create a new project")
  .option("-f, --forve", "can overwirte target directory if it exist")
  .action((name, option) => {
    console.log("program is ready to create,name is ", name)
    require("../lib/create")(name, option)
  })


program.parse(process.argv)

// 如何给用户提示？
// 如何开始主流程？
// 如何进程参数的传递？