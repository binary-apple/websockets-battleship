import { WebSocket, WebSocketServer } from 'ws';
// import { randomUUID } from 'crypto';
import { CommandsHandler } from './commands_handler';
import { Reg } from './commands/reg';
import { WssResponse } from './types';

export const wss = (port = 3000) => {
  // const clients = new Map();
  const wss = new WebSocketServer({ port });

  CommandsHandler.registerCommand('reg', new Reg());

  wss.on('connection', function connection(ws: WebSocket) {
    console.log(`New connection to ws://localhost:${port}`);
    // const clientId = randomUUID();
    // clients.set(clientId, ws);

    ws.on('error', console.error);

    ws.on('message', function message(data) {
      const msg = JSON.parse(data.toString()) as WssResponse;
      CommandsHandler.executeCommand(ws, msg.type, msg.data);
    });

    ws.on('close', function close() {
      console.log('Client disconnected');
      // clients.delete(clientId);
    });
  });

  return wss;
};
