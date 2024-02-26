export interface User {
  id: string;
  name: string;
  password: string;
}

export interface WssResponse {
  type: string;
  data: string;
  id: 0;
}

export interface Room {
  id: string;
  player1Id: string;
  player2Id: string | undefined;
}
