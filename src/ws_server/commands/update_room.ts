import { WebSocket } from 'ws';
import { WSCommand } from './abstract_command';
import { RoomsService } from '../services/rooms_service';
import { Room, WssResponse } from '../types';
import { ConnectionService } from '../services/connection_service';
import { UsersService } from '../services/users_service';

interface UpdateRoomOutData {
  roomId: string;
  roomUsers: Array<{ name: string; index: string }>;
}

export class UpdateRoom implements WSCommand {
  name = 'update_room';
  roomsService = RoomsService.getInstance();
  connectionService = ConnectionService.getInstance();
  usersService = UsersService.getInstance();

  execute(ws: WebSocket): void {
    const avalibleRooms: Room[] = this.roomsService.getAvailibleRooms();
    const resData: UpdateRoomOutData[] = avalibleRooms.map((room) => {
      return {
        roomId: room.id,
        roomUsers: [
          {
            name: this.usersService.getUserById(room.player1Id)?.name,
          },
        ],
      } as UpdateRoomOutData;
    });
    const res: WssResponse = {
      type: this.name,
      data: JSON.stringify(resData),
      id: 0,
    };
    ws.send(JSON.stringify(res));
    return;
  }

  validateData(data: string): boolean {
    return data === '';
  }
}
