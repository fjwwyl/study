const WebSocket = require('ws');
const http = require('http');


class WebSocketServer {
    constructor(port = 8080) {
        this.port = port;
        this.server = null;
        this.wss = null;
        this.clients = new Map(); // 存储所有连接的用户
        this.heartbeatInterval = 30000; // 30秒心跳
    }

    initialize() {
        // 创建HTTP服务器
        this.server = http.createServer();

        // 创建WebSocket服务器
        this.wss = new WebSocket.Server({
            server: this.server,
            clientTracking: true
        });

        this.setupEventHandlers();
        this.startHeartbeatCheck();

        this.server.listen(this.port, () => {
            console.log(`WebSocket服务器运行在端口 ${this.port}`);
        });
    }

    setupEventHandlers() {
        this.wss.on('connection', (ws, request) => {
            const clientId = this.generateClientId();
            const clientInfo = {
                id: clientId,
                ws: ws,
                isAlive: true,
                ip: request.socket.remoteAddress,
                connectedAt: new Date(),
                lastHeartbeat: Date.now()
            };

            // 保存客户端信息
            this.clients.set(clientId, clientInfo);

            console.log(`✅ 客户端 ${clientId} 已连接 | 总连接数: ${this.clients.size}`);

            // 发送欢迎消息
            this.sendToClient(clientId, {
                type: 'welcome',
                clientId: clientId,
                message: '连接成功',
                timestamp: Date.now()
            });

            // 设置消息处理器
            ws.on('message', (data) => this.handleMessage(clientId, data));

            // 设置关闭处理器
            ws.on('close', (code, reason) => this.handleClose(clientId, code, reason));

            // 设置错误处理器
            ws.on('error', (error) => this.handleError(clientId, error));

            // 广播新用户上线通知（可选）
            this.broadcast({
                type: 'user_joined',
                clientId: clientId,
                onlineCount: this.clients.size,
                timestamp: Date.now()
            }, clientId); // 排除自己
        });
    }

    // 处理客户端消息
    handleMessage(clientId, data) {
        try {
            const client = this.clients.get(clientId);
            if (!client) return;

            const message = JSON.parse(data.toString());
            console.log(`📨 收到来自 ${clientId} 的消息:`, message);

            // 更新最后活跃时间
            client.lastHeartbeat = Date.now();

            switch (message.type) {
                case 'ping':
                    // 心跳响应
                    this.sendToClient(clientId, {
                        type: 'pong',
                        timestamp: Date.now()
                    });
                    break;

                case 'chat':
                    // 处理聊天消息
                    this.handleChatMessage(clientId, message);
                    break;

                case 'broadcast':
                    // 广播消息
                    this.broadcast({
                        type: 'broadcast',
                        from: clientId,
                        content: message.content,
                        timestamp: Date.now()
                    });
                    break;

                default:
                    console.warn(`未知消息类型: ${message.type}`);
            }
        } catch (error) {
            console.error(`解析客户端 ${clientId} 的消息错误:`, error);
        }
    }

    // 处理聊天消息
    handleChatMessage(fromClientId, message) {
        const chatMessage = {
            type: 'chat',
            from: fromClientId,
            content: message.content,
            timestamp: Date.now(),
            messageId: this.generateMessageId()
        };

        if (fromClientId) {
            // 同时给自己也发一份，用于确认
            this.sendToClient(fromClientId, chatMessage);
        } else {
            // 群发消息
            this.broadcast(chatMessage, fromClientId);
        }
    }

    // 处理连接关闭
    handleClose(clientId, code, reason) {
        const client = this.clients.get(clientId);
        if (client) {
            this.clients.delete(clientId);
            console.log(`❌ 客户端 ${clientId} 已断开 | 代码: ${code} | 原因: ${reason || '无'} | 剩余连接: ${this.clients.size}`);

            // 广播用户下线通知
            this.broadcast({
                type: 'user_left',
                clientId: clientId,
                onlineCount: this.clients.size,
                timestamp: Date.now()
            });
        }
    }

    // 处理错误
    handleError(clientId, error) {
        console.error(`客户端 ${clientId} 发生错误:`, error);
    }

    // 发送消息给特定客户端
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.send(JSON.stringify(message));
            } catch (error) {
                console.error(`向客户端 ${clientId} 发送消息失败:`, error);
                this.handleClose(clientId, 1006, 'Send error');
            }
        }
    }

    // 广播消息给所有客户端
    broadcast(message, excludeClientId = null) {
        const messageStr = JSON.stringify(message);
        this.clients.forEach((client, clientId) => {
            if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
                try {
                    client.ws.send(messageStr);
                } catch (error) {
                    console.error(`广播消息到客户端 ${clientId} 失败:`, error);
                }
            }
        });
    }

    // 心跳检测机制
    startHeartbeatCheck() {
        setInterval(() => {
            const now = Date.now();
            const timeout = this.heartbeatInterval + 10000; // 超时时间：心跳间隔+10秒

            this.clients.forEach((client, clientId) => {
                // 检查最后活跃时间
                if (now - client.lastHeartbeat > timeout) {
                    console.log(`💔 客户端 ${clientId} 心跳超时，强制断开`);
                    client.ws.terminate(); // 强制关闭连接
                    this.clients.delete(clientId);
                }
            });
        }, this.heartbeatInterval);
    }

    // 生成客户端ID
    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 生成消息ID
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 获取服务器状态
    getStatus() {
        return {
            onlineCount: this.clients.size,
            uptime: process.uptime(),
            timestamp: Date.now()
        };
    }

    // 优雅关闭服务器
    shutdown() {
        console.log('正在关闭WebSocket服务器...');

        // 通知所有客户端
        this.broadcast({
            type: 'server_shutdown',
            message: '服务器即将维护',
            timestamp: Date.now()
        });

        // 关闭所有连接
        this.clients.forEach((client) => {
            client.ws.close(1001, 'Server shutdown');
        });

        // 关闭服务器
        if (this.wss) {
            this.wss.close(() => {
                console.log('WebSocket服务器已关闭');
                process.exit(0);
            });
        }
    }
}

// 创建并启动服务器
const wsServer = new WebSocketServer(8080);
wsServer.initialize();

// 优雅关闭处理
process.on('SIGINT', () => wsServer.shutdown());
process.on('SIGTERM', () => wsServer.shutdown());