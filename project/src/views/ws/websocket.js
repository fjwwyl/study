import {ref, onUnmounted, onMounted} from 'vue'

export function useWebSocket(url, options = {}) {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000
  } = options

  // 响应式数据
  const socket = ref(null)
  const isConnected = ref(false)
  const messages = ref([])
  const reconnectCount = ref(0)
  const isConnecting = ref(false)

  // 心跳定时器
  let heartbeatTimer = null
  let reconnectTimer = null

  // 连接WebSocket
  const connect = () => {
    if (isConnecting.value || isConnected.value) return

    try {
      isConnecting.value = true
      socket.value = new WebSocket(url)

      socket.value.onopen = () => {
        console.log('✅ WebSocket连接成功')
        isConnected.value = true
        isConnecting.value = false
        reconnectCount.value = 0
        startHeartbeat()
        onConnected?.()
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleMessage(data)
        } catch (error) {
          console.error('消息解析错误:', error)
        }
      }

      socket.value.onclose = (event) => {
        console.log('❌ WebSocket连接关闭', event.code, event.reason)
        isConnected.value = false
        isConnecting.value = false
        stopHeartbeat()
        handleReconnect()
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket错误:', error)
        isConnected.value = false
        isConnecting.value = false
        stopHeartbeat()
      }

    } catch (error) {
      console.error('创建WebSocket连接失败:', error)
      isConnecting.value = false
      handleReconnect()
    }
  }

  // 处理接收到的消息
  const handleMessage = (data) => {
    messages.value.push({
      ...data,
      timestamp: new Date()
    })

    // 处理心跳响应
    if (data.type === 'pong') {
      console.log('💓 收到心跳响应')
      return
    }

    // 处理欢迎消息
    if (data.type === 'welcome') {
      console.log('🎉 服务器欢迎消息:', data.message)
      return
    }

    // 其他业务消息处理...
    console.log('📨 收到业务消息:', data)
  }

  const clearInfo = () => {
    messages.value.length = 0;
  }


  // 发送消息
  const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(message)
        socket.value.send(messageStr)
        console.log('📤 发送消息:', message)
      } catch (error) {
        console.error('发送消息失败:', error)
      }
    } else {
      console.warn('WebSocket未连接，无法发送消息')
    }
  }

  // 发送心跳
  const sendHeartbeat = () => {
    if (isConnected.value) {
      sendMessage({type: 'ping', timestamp: Date.now()})
    }
  }

  // 开始心跳
  const startHeartbeat = () => {
    stopHeartbeat()
    heartbeatTimer = setInterval(sendHeartbeat, heartbeatInterval)
  }

  // 停止心跳
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // 处理重连
  const handleReconnect = () => {
    if (reconnectCount.value < reconnectAttempts) {
      reconnectCount.value++
      console.log(`🔄 尝试重连 (${reconnectCount.value}/${reconnectAttempts})...`)

      reconnectTimer = setTimeout(() => {
        connect()
      }, reconnectInterval)
    } else {
      console.error('❌ 重连次数已达上限，停止重连')
    }
  }

  // 断开连接
  const disconnect = () => {
    stopHeartbeat()
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    if (socket.value) {
      socket.value.close(1000, '手动关闭')
      socket.value = null
    }

    isConnected.value = false
    isConnecting.value = false
  }

  // 连接成功回调
  const onConnected = options.onConnected

  // 自动连接
  if (autoConnect) {
    onMounted(() => {
      connect()
    })
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    isConnecting,
    messages,
    clearInfo,
    connect,
    disconnect,
    sendMessage,
    reconnectCount
  }
}