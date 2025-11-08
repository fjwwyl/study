<template>
  <div class="upload-container">
    <!-- 上传区域：支持点击和拖拽 -->
    <div class="upload-area" @click="triggerFileInput" @drop="handleDrop" @dragover.prevent>
      <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          multiple
          :webkitdirectory="enableDirectory"
          :directory="enableDirectory"
          style="display: none"
      />
      <div class="upload-placeholder">
        <i class="upload-icon">📁</i>
        <p>点击选择文件或拖拽文件到此处</p>
        <p v-if="enableDirectory" class="directory-hint">支持文件夹上传</p>
      </div>
    </div>

    <!-- 上传控制按钮组 -->
    <div class="upload-controls">
      <!-- 切换文件/文件夹上传模式 -->
      <button @click="toggleDirectoryUpload" :class="{ active: enableDirectory }">
        {{ enableDirectory ? '文件夹模式' : '文件模式' }}
      </button>
      <!-- 暂停所有上传任务 -->
      <button @click="pauseAll" :disabled="!isUploading">暂停所有</button>
      <!-- 恢复所有暂停的任务 -->
      <button @click="resumeAll" :disabled="!hasPaused">恢复所有</button>
    </div>

    <!-- 上传任务列表 -->
    <div class="upload-list" v-if="uploadTasks.length > 0">
      <div v-for="task in uploadTasks" :key="task.id" class="upload-item">
        <!-- 文件信息展示 -->
        <div class="file-info">
          <span class="file-name">{{ task.file.name }}</span>
          <span class="file-size">{{ formatFileSize(task.file.size) }}</span>
        </div>

        <!-- 进度条容器 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: `${task.progress}%` }"
                :class="{ 'uploading': task.status === 'uploading', 'paused': task.status === 'paused' }"
            ></div>
          </div>
          <span class="progress-text">{{ task.progress.toFixed(1) }}%</span>
        </div>

        <!-- 上传状态和控制按钮 -->
        <div class="upload-status">
          <span :class="`status-${task.status}`">{{ statusText[task.status] }}</span>
          <button
              v-if="task.status === 'uploading'"
              @click="pauseUpload(task.id)"
              class="control-btn"
          >暂停
          </button>
          <button
              v-if="task.status === 'paused'"
              @click="resumeUpload(task.id)"
              class="control-btn"
          >继续
          </button>
          <button
              v-if="task.status === 'error'"
              @click="retryUpload(task.id)"
              class="control-btn"
          >重试
          </button>
        </div>
      </div>
    </div>

    <!-- 全局进度条 -->
    <div class="global-progress" v-if="totalProgress > 0">
      <div class="global-progress-bar">
        <div class="global-progress-fill" :style="{ width: `${totalProgress}%` }"></div>
      </div>
      <span>总进度: {{ totalProgress.toFixed(1) }}%</span>
    </div>
  </div>
  <div>
    {{ uploadTasks }}
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {UploadManager} from "../../components/upload/chunk";

// 响应式数据
const fileInput = ref(null) // 文件输入框引用
const uploadTasks = ref([]) // 上传任务列表
const enableDirectory = ref(false) // 是否启用文件夹上传
const uploadManager = ref(null) // 上传管理器实例

// 状态文本映射表
const statusText = {
  pending: '等待上传',
  uploading: '上传中',
  paused: '已暂停',
  completed: '已完成',
  error: '上传失败'
}

// 计算属性：是否有正在上传的任务
const isUploading = computed(() =>
    uploadTasks.value.some(task => task.status === 'uploading')
)

// 计算属性：是否有暂停的任务
const hasPaused = computed(() =>
    uploadTasks.value.some(task => task.status === 'paused')
)

// 计算属性：计算总进度（所有任务进度的平均值）
const totalProgress = computed(() => {
  if (uploadTasks.value.length === 0) return 0
  const total = uploadTasks.value.reduce((sum, task) => sum + task.progress, 0)
  return total / uploadTasks.value.length
})

// 生命周期：组件挂载时初始化上传管理器
onMounted(() => {
  uploadManager.value = new UploadManager({
    maxConcurrent: 3, // 最大并发上传数
    chunkSize: 2 * 1024 * 1024, // 分片大小：2MB
    retryCount: 3, // 失败重试次数
    onTaskUpdate: updateTask // 任务更新回调
  })
  loadPendingTasks() // 加载未完成的任务

})

// 生命周期：组件销毁前清理资源
onBeforeUnmount(() => {
  if (uploadManager.value) {
    uploadManager.value.destroy()
  }
})

/**
 * 触发文件选择对话框
 */
const triggerFileInput = () => {
  fileInput.value.click()
}

/**
 * 处理文件选择事件
 * @param {Event} event - 文件选择事件
 */
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    addFiles(files)
  }
  // 重置input，允许选择相同文件
  event.target.value = ''
}

/**
 * 处理文件拖放事件
 * @param {DragEvent} event - 拖放事件
 */
const handleDrop = (event) => {
  event.preventDefault()
  const items = Array.from(event.dataTransfer.items)
  const files = []

  /**
   * 递归处理文件系统条目
   * @param {FileSystemEntry} entry - 文件系统条目
   */
  const processEntry = (entry) => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        // 如果是文件，获取文件对象
        entry.file(file => {
          files.push(file)
          resolve()
        })
      } else if (entry.isDirectory) {
        // 如果是目录，递归读取所有文件
        const reader = entry.createReader()
        reader.readEntries(entries => {
          Promise.all(entries.map(processEntry)).then(resolve)
        })
      }
    })
  }

  // 处理所有拖放的项目
  Promise.all(
      items.map(item => {
        const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null
        if (entry) {
          return processEntry(entry)
        } else if (item.getAsFile()) {
          files.push(item.getAsFile())
        }
      })
  ).then(() => {
    if (files.length > 0) {
      addFiles(files)
    }
  })
}

/**
 * 添加文件到上传队列
 * @param {File[]} files - 文件列表
 */
const addFiles = (files) => {
  files.forEach(file => {
    const task = {
      id: generateId(), // 生成唯一ID
      file: file,
      progress: 0,
      status: 'pending'
    }
    uploadTasks.value.push(task)
    uploadManager.value.addTask(task) // 添加到上传管理器
  })
}

/**
 * 切换文件夹上传模式
 */
const toggleDirectoryUpload = () => {
  enableDirectory.value = !enableDirectory.value
}

/**
 * 暂停指定任务的上传
 * @param {string} taskId - 任务ID
 */
const pauseUpload = (taskId) => {
  uploadManager.value.pauseTask(taskId)
}

/**
 * 恢复指定任务的上传
 * @param {string} taskId - 任务ID
 */
const resumeUpload = (taskId) => {
  uploadManager.value.resumeTask(taskId)
}

/**
 * 暂停所有上传任务
 */
const pauseAll = () => {
  uploadManager.value.pauseAll()
}

/**
 * 恢复所有暂停的任务
 */
const resumeAll = () => {
  uploadManager.value.resumeAll()
}

/**
 * 重试失败的任务
 * @param {string} taskId - 任务ID
 */
const retryUpload = (taskId) => {
  uploadManager.value.retryTask(taskId)
}

/**
 * 更新任务状态（上传管理器回调）
 * @param {Object} updatedTask - 更新后的任务对象
 */
const updateTask = (updatedTask) => {
  const index = uploadTasks.value.findIndex(task => task.id === updatedTask.id)
  if (index !== -1) {
    uploadTasks.value[index] = {...uploadTasks.value[index], ...updatedTask}
  }
}

/**
 * 加载未完成的上传任务（断点续传）
 */
const loadPendingTasks = async () => {
  const pendingTasks = await uploadManager.value.getPendingTasks()
  uploadTasks.value.push(...pendingTasks)
}

/**
 * 生成唯一ID
 * @returns {string} 唯一标识符
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
/* 样式代码保持不变 */
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  margin-bottom: 20px;
}

.upload-area:hover {
  border-color: #409eff;
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.directory-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.upload-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-controls button {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-controls button:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.upload-controls button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.upload-controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-item {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 15px;
  background: #fafafa;
}

.file-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.file-name {
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.file-size {
  color: #909399;
  margin-left: 10px;
  flex-shrink: 0;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #67c23a;
  transition: width 0.3s;
}

.progress-fill.uploading {
  background: #409eff;
}

.progress-fill.paused {
  background: #e6a23c;
}

.progress-text {
  font-size: 12px;
  color: #909399;
  min-width: 40px;
}

.upload-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-btn {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.control-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.status-pending {
  color: #909399;
}

.status-uploading {
  color: #409eff;
}

.status-paused {
  color: #e6a23c;
}

.status-completed {
  color: #67c23a;
}

.status-error {
  color: #f56c6c;
}

.global-progress {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.global-progress-bar {
  flex: 1;
  height: 8px;
  background: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.global-progress-fill {
  height: 100%;
  background: #409eff;
  transition: width 0.3s;
}
</style>