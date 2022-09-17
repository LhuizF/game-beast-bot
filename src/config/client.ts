import { Client, GatewayIntentBits } from 'discord.js';
import { REST, Routes } from 'discord.js';
import { Command } from '../protocols/commands';
import { useCommands } from './commands';

class Bot {
  private commands: Map<string, Command>;
  constructor(readonly client: Client, private readonly rest: REST) {}

  async init() {
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
  }

  async login(token: string) {
    await this.init();
    this.client.login(token);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || '');

export const bot = new Bot(client, rest);
