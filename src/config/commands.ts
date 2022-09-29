import fs from 'fs';
import { Command } from '../types/protocols/command';

export const useCommands = async () => {
  const commands: Array<[string, Command]> = await Promise.all(
    fs.readdirSync('./src/commands').map(async (file) => {
      const command = (await import(`../commands/${file}`)).default;
      console.log(`/${command.name}`);
      return [command.name, { ...command, handle: command.handle }];
    })
  );

  return new Map<string, Command>(commands);
};
