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
      console.log(`Command ${commandName} is not implemented.`);
      return;
    }
    return this.commandRegistry.get(commandName).execute(ws, commandData);
  }
}
