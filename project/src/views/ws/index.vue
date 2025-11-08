<template>
  <div class="websocket-demo">
    <div class="status">
      <div class="status-indicator" :class="connectionStatus"></div>
      <span>状态: {{ statusText }}</span>
      <span v-if="reconnectCount > 0">(重连: {{ reconnectCount }})</span>
    </div>

    <div class="controls">
      <button
          @click="connect"
          :disabled="isConnected || isConnecting"
          class="btn btn-success"
      >
        {{ isConnecting ? '连接中...' : '连接' }}
      </button>
      <button
          @click="disconnect"
          :disabled="!isConnected"
          class="btn btn-danger"
      >
        断开
      </button>
      <button
          @click="sendPing"
          :disabled="!isConnected"
          class="btn btn-info"
      >
        发送心跳
      </button>
      <button
          @click="sendTestMessage"
          :disabled="!isConnected"
          class="btn btn-primary"
      >
        测试消息
      </button>
      <button
          @click="clearInfo"
          class="btn btn-primary"
      >
        清空信息
      </button>
    </div>

    <div class="message-input">
      <input
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="sendCustomMessage"
          class="input"
      />
      <button
          @click="sendCustomMessage"
          :disabled="!isConnected"
          class="btn btn-primary"
      >
        发送
      </button>
    </div>

    <div class="messages">
      <h3>消息列表 ({{ messages.length }})</h3>
      <div class="message-list">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-item"
            :class="getMessageClass(msg)"
        >
          <div class="message-time">
            {{ formatTime(msg.timestamp) }}
          </div>
          <div class="message-content">
            {{ msg.type }}: {{ JSON.stringify(msg) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useWebSocket} from './websocket'

const inputMessage = ref('')

// 使用WebSocket Hook
const {
  isConnected,
  isConnecting,
  messages,
  connect,
  disconnect,
  sendMessage,
  clearInfo,
  reconnectCount
} = useWebSocket('ws://localhost:8080', {
  autoConnect: true,
  reconnectAttempts: 5,
  reconnectInterval: 3000,
  onConnected: () => {
    console.log('🎉 连接成功回调执行')
  }
})

// 计算连接状态
const connectionStatus = computed(() => ({
  'status-connected': isConnected.value,
  'status-connecting': isConnecting.value,
  'status-disconnected': !isConnected.value && !isConnecting.value
}))

const statusText = computed(() => {
  if (isConnected.value) return '已连接'
  if (isConnecting.value) return '连接中...'
  return '未连接'
})

// 发送心跳
const sendPing = () => {
  sendMessage({type: 'ping', timestamp: Date.now()})
}

// 发送测试消息
const sendTestMessage = () => {
  sendMessage({
    type: 'chat',
    content: '这是一条测试消息',
    timestamp: Date.now()
  })
}


// 发送自定义消息
const sendCustomMessage = () => {
  if (inputMessage.value.trim()) {
    sendMessage({
      type: 'chat',
      content: inputMessage.value,
      timestamp: Date.now()
    })
    inputMessage.value = ''
  }
}

// 获取消息样式类
const getMessageClass = (msg) => {
  return {
    'message-incoming': msg.type !== 'ping',
    'message-heartbeat': msg.type === 'pong'
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}
</script>

<style scoped>
.websocket-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
}

.status-connected .status-indicator {
  background: #4CAF50;
}

.status-connecting .status-indicator {
  background: #FFC107;
  animation: pulse 1.5s infinite;
}

.status-disconnected .status-indicator {
  background: #F44336;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background: #4CAF50;
  color: white;
}

.btn-danger {
  background: #F44336;
  color: white;
}

.btn-info {
  background: #2196F3;
  color: white;
}

.btn-primary {
  background: #673AB7;
  color: white;
}

.message-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.messages {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
}

.message-incoming {
  background: #E3F2FD;
  border-left-color: #2196F3;
}

.message-heartbeat {
  background: #E8F5E8;
  border-left-color: #4CAF50;
}

.message-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.message-content {
  font-family: monospace;
  font-size: 14px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>