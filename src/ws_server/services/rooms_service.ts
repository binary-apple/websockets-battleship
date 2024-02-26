import { randomUUID } from 'crypto';
import { Room } from 'ws_server/types';

export class RoomsService {
  private static instance: RoomsService;
  private rooms: Room[] = [];

  static getInstance(): RoomsService {
    if (!RoomsService.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance;
  }

  public createRoom(userId: string): Room {
    const newRoom: Room = {
      id: randomUUID(),
      player1Id: userId,
      player2Id: undefined,
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  public addUserToRoom(userId: string, roomId: string): Room | undefined {
    const room = this.rooms.find((room) => room.id === roomId);
    if (!room || room.player2Id) {
      return;
    }
    room.player2Id = userId;
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
    return room;
  }

  public getAvailibleRooms(): Room[] {
    return this.rooms;
  }
}
