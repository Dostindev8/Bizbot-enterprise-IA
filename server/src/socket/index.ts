import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function setupSocketIO(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Client connected to real-time WebSocket');

    socket.on('join:organization', (orgId: string) => {
      socket.join(`org_${orgId}`);
      logger.debug({ socketId: socket.id, orgId }, 'Socket joined organization room');
    });

    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conv_${conversationId}`);
      logger.debug({ socketId: socket.id, conversationId }, 'Socket joined conversation room');
    });

    socket.on('conversation:typing', (data: { conversationId: string; user: string }) => {
      socket.to(`conv_${data.conversationId}`).emit('conversation:typing', data);
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected from WebSocket');
    });
  });

  return io;
}
