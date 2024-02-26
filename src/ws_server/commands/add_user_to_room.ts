import { WebSocket } from 'ws';
import { WSCommand } from './abstract_command';
import { RoomsService } from '../services/rooms_service';
import { ConnectionService } from '../services/connection_service';
import { UpdateRoom } from './update_room';
import { Room, WssResponse } from '../types';
import { randomUUID } from 'crypto';

interface AddUserToRoomInData {
  indexRoom: string;
}

interface AddUserToRoomOutData {
  idGame: string;
  idPlayer: string;
}

export class AddUserToRoom implements WSCommand {
  name = 'add_user_to_room';
  roomsService = RoomsService.getInstance();
  connectionService = ConnectionService.getInstance();
  updateRoomCommand = new UpdateRoom();

  execute(ws: WebSocket, data: string): void {
    if (!this.validateData(data)) {
      return;
    }

    const parsedData: AddUserToRoomInData = JSON.parse(
      data,
    ) as AddUserToRoomInData;

    const user = this.connectionService.getUserByConnection(ws);
    if (!user) {
      return;
    }

    const room: Room | undefined = this.roomsService.addUserToRoom(
      user.id,
      parsedData.indexRoom,
    );
    if (!room) {
      return;
    }

    const idGame = randomUUID();

    const user1Connections = this.connectionService.getConnectionsByUserId(
      room.player1Id,
    );
    user1Connections.forEach((ws) => {
      const resData: AddUserToRoomOutData = {
        idGame: idGame,
        idPlayer: room.player1Id,
      };
      const res: WssResponse = {
        type: 'create_game',
        data: JSON.stringify(resData),
        id: 0,
      };
      ws.send(JSON.stringify(res));
    });

    const user2Connections = this.connectionService.getConnectionsByUserId(
      user.id,
    );
    user2Connections.forEach((ws) => {
      const resData: AddUserToRoomOutData = {
        idGame: idGame,
        idPlayer: room.player1Id,
      };
      const res: WssResponse = {
        type: 'create_game',
        data: JSON.stringify(resData),
        id: 0,
      };
      ws.send(JSON.stringify(res));
    });

    this.connectionService.executeForAllConnections((ws: WebSocket) => {
      this.updateRoomCommand.execute(ws);
    });

    return;
  }

  validateData(data: string): boolean {
    const parsedData = JSON.parse(data);
    return parsedData.indexRoom && typeof parsedData.indexRoom === 'string';
  }
}
