import { WebSocket, WebSocketServer } from 'ws';
// import { randomUUID } from 'crypto';
import { CommandsHandler } from './commands_handler';
import { Reg } from './commands/reg';
import { WssResponse } from './types';
import { ConnectionService } from './services/connection_service';
import { CreateRoom } from './commands/create_room';
import { UpdateRoom } from './commands/update_room';
import { AddUserToRoom } from './commands/add_user_to_room';

export const wss = (port = 3000) => {
  // const clients = new Map();
  const wss = new WebSocketServer({ port });

  CommandsHandler.registerCommand('reg', new Reg());
  CommandsHandler.registerCommand('create_room', new CreateRoom());
  CommandsHandler.registerCommand('update_room', new UpdateRoom());
  CommandsHandler.registerCommand('add_user_to_room', new AddUserToRoom());
  const connectionService = ConnectionService.getInstance();

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
      if (connectionService.getUserByConnection(ws)) {
        connectionService.deleteConnection(ws);
      }
    });
  });

  return wss;
};
