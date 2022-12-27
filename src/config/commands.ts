import fs from 'fs';
import path from 'path';
import { Command } from '../types/protocols/command';
import { LogDecorator } from '../decorator/logDecorator';

export const useCommands = async () => {
  const commandsFolder = path.join(__dirname, '../', './commands');

  const commands: Array<[string, Command]> = await Promise.all(
    fs.readdirSync(commandsFolder).map(async (file) => {
      const CommandClass = (await import(`../commands/${file}`)).default;
      const command = new CommandClass();
      const commandWithLog = new LogDecorator(command);
      console.log(`/${commandWithLog.name}`);
      return [commandWithLog.name, { ...commandWithLog, handle: commandWithLog.handle }];
    })
  );

  return new Map<string, Command>(commands);
};
