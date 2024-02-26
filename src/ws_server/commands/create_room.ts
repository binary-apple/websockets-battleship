import { WebSocket } from 'ws';
import { WSCommand } from './abstract_command';
import { RoomsService } from '../services/rooms_service';
import { ConnectionService } from '../services/connection_service';
import { UpdateRoom } from './update_room';

export class CreateRoom implements WSCommand {
  name = 'create_room';
  roomsService = RoomsService.getInstance();
  connectionService = ConnectionService.getInstance();
  updateRoomCommand = new UpdateRoom();

  execute(ws: WebSocket): void {
    const user = this.connectionService.getUserByConnection(ws);
    if (!user) {
      return;
    }
    this.roomsService.createRoom(user.id);

    this.connectionService.executeForAllConnections((ws: WebSocket) => {
      this.updateRoomCommand.execute(ws);
    });

    return;
  }

  validateData(data: string): boolean {
    return data === '';
  }
}
