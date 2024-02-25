import { WSCommand } from './commands/abstract_command';
import { WebSocket } from 'ws';

export class CommandsHandler {
  static commandRegistry = new Map();

  static registerCommand(commandName: string, commandInstance: WSCommand) {
    this.commandRegistry.set(commandName, commandInstance);
  }

  static executeCommand(
    ws: WebSocket,
    commandName: string,
    commandData: string,
  ) {
    if (!this.commandRegistry.has(commandName)) {
      throw new Error(`Command ${commandName} is not implemented.`);
    }
    console.log(commandData);
    return this.commandRegistry.get(commandName).execute(ws, commandData);
  }
}
