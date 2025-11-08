// upload-manager.js

/**
 * 文件上传管理器类
 * 核心功能：分片上传、并发控制、断点续传、错误重试
 */
class UploadManager {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {number} options.maxConcurrent - 最大并发数
   * @param {number} options.chunkSize - 分片大小（字节）
   * @param {number} options.retryCount - 重试次数
   * @param {Function} options.onTaskUpdate - 任务更新回调
   */
  constructor(options = {}) {
    this.options = {
      maxConcurrent: 3,
      chunkSize: 2 * 1024 * 1024, // 2MB
      retryCount: 3,
      onTaskUpdate: () => {},
      ...options
    }

    this.tasks = new Map() // 存储所有任务：Map<taskId, task>
    this.uploadingTasks = new Set() // 正在上传的任务ID集合
    this.db = null // IndexedDB数据库实例
    this.initDB() // 初始化数据库
  }

  /**
   * 初始化IndexedDB数据库
   * 知识点：IndexedDB用于持久化存储上传状态，支持断点续传
   */
  async initDB() {
    this.db = await this.openDB()
  }

  /**
   * 打开或创建IndexedDB数据库
   * @returns {Promise<IDBDatabase>} 数据库实例
   */
  openDB() {
    return new Promise((resolve, reject) => {
      // 打开数据库，版本为1
      const request = indexedDB.open('UploadManagerDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      // 数据库升级时创建对象存储空间
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        // 创建uploadTasks对象存储空间
        if (!db.objectStoreNames.contains('uploadTasks')) {
          const store = db.createObjectStore('uploadTasks', { keyPath: 'id' })
          // 创建状态索引，用于查询特定状态的任务
          store.createIndex('status', 'status', { unique: false })
        }
      }
    })
  }

  /**
   * 添加上传任务
   * @param {Object} task - 上传任务
   * @param {File} task.file - 文件对象
   */
  async addTask(task) {
    // 计算任务元数据
    const taskWithMeta = {
      ...task,
      uploadedChunks: 0, // 已上传分片数
      totalChunks: Math.ceil(task.file.size / this.options.chunkSize), // 总分片数
      status: 'pending', // 初始状态
      createdAt: Date.now() // 创建时间
    }

    // 存储任务到内存和数据库
    this.tasks.set(task.id, taskWithMeta)
    await this.saveTaskToDB(taskWithMeta)
    this.options.onTaskUpdate(taskWithMeta)
    this.processQueue() // 处理上传队列
  }

  /**
   * 暂停指定任务
   * @param {string} taskId - 任务ID
   */
  async pauseTask(taskId) {
    const task = this.tasks.get(taskId)
    if (task && task.status === 'uploading') {
      task.status = 'paused'
      this.uploadingTasks.delete(taskId) // 从上传集合中移除
      await this.saveTaskToDB(task)
      this.options.onTaskUpdate(task)
      this.processQueue() // 重新处理队列，可能启动其他任务
    }
  }

  /**
   * 恢复指定任务
   * @param {string} taskId - 任务ID
   */
  async resumeTask(taskId) {
    const task = this.tasks.get(taskId)
    if (task && task.status === 'paused') {
      task.status = 'pending' // 改为等待状态
      await this.saveTaskToDB(task)
      this.options.onTaskUpdate(task)
      this.processQueue() // 重新加入上传队列
    }
  }

  /**
   * 暂停所有上传任务
   */
  async pauseAll() {
    // 遍历所有正在上传的任务并暂停
    for (const taskId of this.uploadingTasks) {
      await this.pauseTask(taskId)
    }
  }

  /**
   * 恢复所有暂停的任务
   */
  async resumeAll() {
    // 查找所有暂停的任务
    const pausedTasks = Array.from(this.tasks.values())
      .filter(task => task.status === 'paused')

    // 逐个恢复
    for (const task of pausedTasks) {
      await this.resumeTask(task.id)
    }
  }

  /**
   * 重试失败的任务
   * @param {string} taskId - 任务ID
   */
  async retryTask(taskId) {
    const task = this.tasks.get(taskId)
    if (task && task.status === 'error') {
      task.status = 'pending'
      task.retryCount = 0 // 重置重试计数
      await this.saveTaskToDB(task)
      this.options.onTaskUpdate(task)
      this.processQueue()
    }
  }

  /**
   * 处理上传队列
   * 知识点：并发控制核心算法，确保同时运行的任务不超过最大并发数
   */
  async processQueue() {
    // 当正在上传的任务数小于最大并发数时，继续添加任务
    while (this.uploadingTasks.size < this.options.maxConcurrent) {
      const pendingTask = this.getNextPendingTask()
      if (!pendingTask) break // 没有等待的任务时退出

      // 标记任务为上传中
      this.uploadingTasks.add(pendingTask.id)
      pendingTask.status = 'uploading'
      this.options.onTaskUpdate(pendingTask)

      // 开始上传任务，完成后继续处理队列
      this.uploadTask(pendingTask).finally(() => {
        this.uploadingTasks.delete(pendingTask.id)
        this.processQueue() // 递归调用以处理下一个任务
      })
    }
  }

  /**
   * 获取下一个等待上传的任务
   * @returns {Object|null} 任务对象或null
   */
  getNextPendingTask() {
    return Array.from(this.tasks.values())
      .find(task => task.status === 'pending')
  }

  /**
   * 执行文件上传任务
   * @param {Object} task - 上传任务
   */
  async uploadTask(task) {
    const { file, uploadedChunks, totalChunks } = task

    // 遍历所有分片，从已上传的分片之后开始
    for (let chunkIndex = uploadedChunks; chunkIndex < totalChunks; chunkIndex++) {
      // 如果任务状态不是上传中，中断上传
      if (task.status !== 'uploading') break

      // 切割文件分片
      const chunk = file.slice(
        chunkIndex * this.options.chunkSize,
        Math.min((chunkIndex + 1) * this.options.chunkSize, file.size)
      )

      let success = false
      let retryCount = 0

      // 重试机制：失败后重试，直到成功或超过重试次数
      while (!success && retryCount <= this.options.retryCount) {
        try {
          await this.uploadChunk(task, chunk, chunkIndex)
          success = true
          // 更新已上传分片数和进度
          task.uploadedChunks = chunkIndex + 1
          task.progress = (task.uploadedChunks / totalChunks) * 100
          await this.saveTaskToDB(task)
          this.options.onTaskUpdate(task)
        } catch (error) {
          retryCount++
          if (retryCount > this.options.retryCount) {
            // 超过重试次数，标记任务为失败
            task.status = 'error'
            task.error = error.message
            await this.saveTaskToDB(task)
            this.options.onTaskUpdate(task)
            return
          }
        }
      }
    }

    // 所有分片上传完成，执行完成操作
    if (task.uploadedChunks === totalChunks && task.status === 'uploading') {
      await this.completeUpload(task)
    }
  }

  /**
   * 上传单个文件分片
   * @param {Object} task - 上传任务
   * @param {Blob} chunk - 文件分片
   * @param {number} chunkIndex - 分片索引
   */
  async uploadChunk(task, chunk, chunkIndex) {
    // 创建FormData对象，包含分片数据和元数据
    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('chunkIndex', chunkIndex)
    formData.append('totalChunks', task.totalChunks)
    formData.append('fileName', task.file.name)
    formData.append('fileSize', task.file.size)
    formData.append('taskId', task.id)
    formData.append('identifier', await this.getFileIdentifier(task.file))

    // 发送分片上传请求
    const response = await fetch('/upload/chunk', {
      method: 'POST',
      body: formData
    })

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message || 'Upload failed')
    }
  }

  /**
   * 完成文件上传（通知服务器合并分片）
   * @param {Object} task - 上传任务
   */
  async completeUpload(task) {
    const response = await fetch('/upload/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: task.file.name,
        fileSize: task.file.size,
        taskId: task.id,
        identifier: await this.getFileIdentifier(task.file),
        totalChunks: task.totalChunks
      })
    })

    if (response.ok) {
      // 上传成功，更新状态并清理数据
      task.status = 'completed'
      task.progress = 100
      await this.removeTaskFromDB(task.id)
      this.tasks.delete(task.id)
    } else {
      throw new Error('Complete upload failed')
    }

    this.options.onTaskUpdate(task)
  }

  /**
   * 生成文件唯一标识符
   * 知识点：使用文件头部内容和文件大小生成唯一标识，用于断点续传
   * @param {File} file - 文件对象
   * @returns {Promise<string>} 文件标识符
   */
  async getFileIdentifier(file) {
    // 读取文件前1KB内容用于生成哈希
    const buffer = await file.slice(0, 1024).arrayBuffer()
    // 使用SHA-256算法生成哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    // 将哈希值转换为十六进制字符串，并附加文件大小
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') + file.size
  }

  /**
   * 保存任务到IndexedDB
   * @param {Object} task - 任务对象
   */
  async saveTaskToDB(task) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['uploadTasks'], 'readwrite')
      const store = transaction.objectStore('uploadTasks')
      const request = store.put(task) // 存储或更新任务

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * 从IndexedDB删除任务
   * @param {string} taskId - 任务ID
   */
  async removeTaskFromDB(taskId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['uploadTasks'], 'readwrite')
      const store = transaction.objectStore('uploadTasks')
      const request = store.delete(taskId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * 获取所有未完成的任务（用于断点续传）
   * @returns {Promise<Array>} 未完成的任务列表
   */
  async getPendingTasks() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['uploadTasks'], 'readonly')
      const store = transaction.objectStore('uploadTasks')
      const index = store.index('status')
      // 查询所有状态为pending的任务
      const request = index.getAll('pending')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  /**
   * 销毁上传管理器，清理资源
   */
  destroy() {
    this.tasks.clear()
    this.uploadingTasks.clear()
    if (this.db) {
      this.db.close()
    }
  }
}

export { UploadManager }