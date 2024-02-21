import { randomUUID } from 'crypto';
import { User } from 'ws_server/types';

export class UsersService {
  private static instance: UsersService;
  private users: User[] = [];

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  addUser(login: string, password: string): User {
    const newUser: User = { id: randomUUID(), login, password };
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByLoginAndPassword(login: string, password: string): User | undefined {
    const user = this.users.find((user) => user.login === login);
    if (!user) {
      return this.addUser(login, password);
    } else {
      return user.password === password ? user : undefined;
    }
  }
}
