import { WebSocket } from 'ws';

export abstract class WSCommand {
  abstract name: string;

  abstract execute(ws: WebSocket, data: string): void;

  abstract validateData(data: string): boolean;
}
