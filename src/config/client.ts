import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { Bot } from '../protocols/bot';
import { Command } from '../protocols/commands';
import { useCommands } from './commands';

export class ClientBot implements Bot {
  private commands: Map<string, Command>;
  constructor(readonly client: Client, private readonly rest: REST) {}

  async start(token: string) {
    try {
      this.commands = await useCommands();

      const commands = Array.from(this.commands.values());

      await this.rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ''), {
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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || '');

export const clientBot = new ClientBot(client, rest);
