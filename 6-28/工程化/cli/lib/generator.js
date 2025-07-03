/**
 * ora 是一个流行的 Node.js 命令行加载动画（Spinner）工具，用于在终端中显示优雅的加载状态（如等待任务完成时的旋转动画），提升命令行工具的用户体验。

 核心功能
 显示加载动画：在长时间任务（如网络请求、文件处理）期间展示旋转图标（默认 ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏）。

 自定义样式：支持修改动画符号、颜色、文本提示等。

 状态切换：动态更新状态（成功 ✅、失败 ❌、警告 ⚠️ 等）。

 自动隐藏：任务完成后可自动停止并显示结果。
 */

const ora = require("ora")

const {getReopList, getTagList} = require("./http")
const inquirer = require("inpuirer")
const util = require("util")
const downloadGitRepo = require("download-git-repo")

//封装一个loading


async function loading(fn, message, ...args) {


  const spinner = ora(message);


  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail("Request failed, please retry");
  }
}

class Generator {

  /**
   *
   * @param name  名字
   * @param targetDir 目标的地址
   */
  constructor(name, targetDir) {
    //目录名
    this.name = name;
    //创建位置
    this.targetDir = targetDir;
    //repo下载
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  //核心创建模板的逻辑
  async create() {
    // 1.获取模板名称

    const repo = await this.getRepo();
    // 2.获取tag名称
    const tag = await this.getTag(repo);


    await this.download(repo, tag);
    // 3.下载模板到目录
  }


  // 1. 获取远端拉去的模板数据
  // 2. 让用户选择已有的模板名称
  // 3. 返回用户选的模板
  async getRepo() {
    const repoList = await loading(getReopList, "waiting for fetch temlaote")

    if (!repoList) {
      return;
    }

    //过滤模板名称

    const repos = repoList.map(m => m.name);


    const {repo} = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "请选择一个模板进行创建"
    })

    return repo;
  }

  // 获取版本信息
  async getTag() {
    //拉去模板列表

    const tagList = await loading(getTagList, "waiting for fetch temlaote")

    return tagList.map(m => m.name)[0];
  }

  //下载模板

  async download(repo, tag) {
    const requestUrl = `FRcourseZone/${repo}${!tag ? "" : "#" + tag}`;
    await loading(downloadGitRepo,
      "waiting for fetch temlaote",
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

}

module.exports = Generator;