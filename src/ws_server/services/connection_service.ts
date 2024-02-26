import { WebSocket } from 'ws';
import { User } from 'ws_server/types';

export class ConnectionService {
  private static instance: ConnectionService;
  private wsToUserId: Map<WebSocket, User> = new Map();

  static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService();
    }
    return ConnectionService.instance;
  }

  public getUserByConnection(ws: WebSocket): User | undefined {
    return this.wsToUserId.get(ws);
  }

  public getConnectionsByUserId(userId: string): WebSocket[] {
    const connections: WebSocket[] = [];
    for (const [ws, user] of this.wsToUserId.entries()) {
      if (user.id === userId) {
        connections.push(ws);
      }
    }
    return connections;
  }

  public setUserByConnection(ws: WebSocket, user: User) {
    this.wsToUserId.set(ws, user);
  }

  public deleteConnection(ws: WebSocket) {
    this.wsToUserId.delete(ws);
  }

  public executeForAllConnections(callback: (ws: WebSocket) => void) {
    for (const ws of this.wsToUserId.keys()) {
      callback(ws);
    }
  }
}
