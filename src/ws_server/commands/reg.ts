import { WebSocket } from 'ws';
import { WSCommand } from './abstract_command';
import { User, WssResponse } from '../types';
import { UsersService } from '../services/users_service';
import { ConnectionService } from '../services/connection_service';
import { UpdateRoom } from './update_room';

interface RegInData {
  name: string;
  password: string;
}

interface RegOutData {
  name: string;
  index: string;
  error: boolean;
  errorText: string;
}

export class Reg implements WSCommand {
  name = 'reg';
  usersService = UsersService.getInstance();
  connectionService = ConnectionService.getInstance();
  updateRoomCommand = new UpdateRoom();

  execute(ws: WebSocket, data: string): void {
    let resData: RegOutData = {
      name: this.name,
      index: '',
      error: true,
      errorText: 'Invalid data',
    };
    let res: WssResponse = {
      type: this.name,
      data: JSON.stringify(resData),
      id: 0,
    };
    if (!this.validateData(data)) {
      ws.send(JSON.stringify(res));
      return;
    }
    const parsedData: RegInData = JSON.parse(data) as RegInData;
    const user: User | undefined = this.usersService.getUserByLoginAndPassword(
      parsedData.name,
      parsedData.password,
    );

    if (!user) {
      ws.send(JSON.stringify(res));
      return;
    }

    resData = {
      name: this.name,
      index: user.id,
      error: false,
      errorText: '',
    };
    res = {
      type: this.name,
      data: JSON.stringify(resData),
      id: 0,
    };

    ws.send(JSON.stringify(res));
    this.connectionService.setUserByConnection(ws, user);
    this.connectionService.executeForAllConnections((ws: WebSocket) => {
      this.updateRoomCommand.execute(ws);
    });
    return;
  }

  validateData(data: string): boolean {
    const parsedData = JSON.parse(data);
    return (
      parsedData.name &&
      typeof parsedData.name === 'string' &&
      parsedData.name.length >= 5 &&
      parsedData.password &&
      typeof parsedData.password === 'string' &&
      parsedData.password.length >= 5
    );
  }
}
