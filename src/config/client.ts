import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { Bot } from '../types/protocols/bot';
import { Command } from '../types/protocols/commands';
import { useCommands } from './commands';

export class ClientBot implements Bot {
  private commands: Map<string, Command>;
  private readonly rest: REST;
  private readonly client: Client;

  constructor(readonly token: string, readonly clientID: string) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.rest = new REST({ version: '10' }).setToken(token);
  }

  async start(token: string) {
    try {
      this.commands = await useCommands();

      const commands = Array.from(this.commands.values());

      await this.rest.put(Routes.applicationCommands(this.clientID), {
        body: commands
      });
    } catch (error) {
      console.error(error);
    }

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const cmd = this.commands.get(interaction.commandName);
      if (!cmd) return;
      cmd.handle(interaction);
    });

    this.client.login(token);
  }

  public getClient(): Client {
    return this.client;
  }
}
