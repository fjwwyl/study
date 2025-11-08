var express = require('express');
var router = express.Router();

router.get('/list', async (req, res, next) => {
  res.status(200).send({
    code: 200,
    data: [],
    message: "success"
  });
});


// server.js
const multer = require('multer') // 文件上传中间件
const fs = require('fs')
const fsp = require('fs').promises // 文件系统Promise API
const path = require('path')
// 配置multer用于处理文件上传，设置临时存储目录
const upload = multer({dest: 'uploads/tmp/'})

/**
 * 确保目录存在的工具函数
 * @param {string} dir - 目录路径
 */
async function ensureDir(dir) {
  try {
    await fsp.access(dir) // 检查目录是否存在
  } catch {
    await fsp.mkdir(dir, {recursive: true}) // 递归创建目录
  }
}

/**
 * 文件分片上传接口
 * 知识点：接收文件分片并存储到临时目录
 */
router.post('/chunk', upload.single('file'), async (req, res) => {
  try {
    // 从请求体中获取分片元数据
    const {chunkIndex, totalChunks, fileName, fileSize, taskId, identifier} = req.body

    // 检查是否接收到文件
    if (!req.file) {
      return res.status(400).json({success: false, message: 'No file uploaded'})
    }

    // 创建以文件标识符命名的上传目录
    const uploadDir = path.join('uploads', identifier)
    await ensureDir(uploadDir)

    // 将临时文件移动到目标目录，以分片索引命名
    const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`)
    await fsp.rename(req.file.path, chunkPath)

    res.json({
      success: true,
      message: 'Chunk uploaded successfully',
      chunkIndex: parseInt(chunkIndex)
    })
  } catch (error) {
    console.error('Upload chunk error:', error)
    res.status(500).json({success: false, message: error.message})
  }
})

/**
 * 完成上传接口：合并所有分片
 * 知识点：读取所有分片文件并按顺序合并成完整文件
 */
router.post('/complete', async (req, res) => {
  try {
    const {fileName, fileSize, taskId, identifier, totalChunks} = req.body

    const uploadDir = path.join('uploads', identifier) // 分片存储目录
    const outputPath = path.join('uploads', 'completed', fileName) // 最终文件路径

    // 确保输出目录存在
    await ensureDir(path.dirname(outputPath))

    // 验证所有分片是否都存在
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(uploadDir, `chunk-${i}`)
      try {
        await fsp.access(chunkPath)
      } catch {
        return res.status(400).json({
          success: false,
          message: `Missing chunk ${i}`
        })
      }
    }

    // 创建文件写入流
    const writeStream = fs.createWriteStream(outputPath)

    // 按顺序读取并写入所有分片
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(uploadDir, `chunk-${i}`)
      const chunkData = await fsp.readFile(chunkPath)
      writeStream.write(chunkData)
    }

    writeStream.end() // 结束写入

    // 写入完成后的处理
    writeStream.on('finish', async () => {
      // 清理临时分片文件
      try {
        await fsp.rm(uploadDir, {recursive: true})
      } catch (error) {
        console.error('Cleanup error:', error)
      }

      res.json({
        success: true,
        message: 'File uploaded successfully',
        filePath: outputPath
      })
    })

    // 写入错误处理
    writeStream.on('error', (error) => {
      throw error
    })

  } catch (error) {
    console.error('Complete upload error:', error)
    res.status(500).json({success: false, message: error.message})
  }
})

/**
 * 获取上传进度接口
 * 知识点：通过检查已存在的分片文件计算上传进度
 */
router.get('/progress/:identifier', async (req, res) => {
  try {
    const {identifier} = req.params
    const uploadDir = path.join('uploads', identifier)

    try {
      // 读取上传目录中的所有文件
      const files = await fsp.readdir(uploadDir)
      // 统计已上传的分片数量（以chunk-开头的文件）
      const uploadedChunks = files.filter(file => file.startsWith('chunk-')).length

      res.json({
        success: true,
        uploadedChunks,
        totalChunks: parseInt(req.query.totalChunks) || 0
      })
    } catch {
      // 目录不存在，说明没有上传任何分片
      res.json({
        success: true,
        uploadedChunks: 0,
        totalChunks: parseInt(req.query.totalChunks) || 0
      })
    }
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
})

/**
 * 初始化必要的目录结构
 */
async function initialize() {
  await ensureDir('uploads/tmp') // 临时文件目录
  await ensureDir('uploads/completed') // 完成文件目录
}

// 执行初始化
initialize().catch(console.error)


module.exports = router;