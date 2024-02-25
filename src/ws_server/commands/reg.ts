import { WebSocket } from 'ws';
import { WSCommand } from './abstract_command';
import { User, WssResponse } from '../types';
import { UsersService } from '../services/users_service';

interface RegInData {
  login: string;
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

  execute(ws: WebSocket, data: string): void {
    console.log(`reg execution with data: ${data}`);
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
      parsedData.login,
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
