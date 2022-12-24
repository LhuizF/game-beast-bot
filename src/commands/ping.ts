import api from '../services/api';
import { Command, Interaction } from '../types/protocols/command';

class Ping implements Command {
  name = 'ping';
  description = 'Replies with Pong!';
  async handle(interaction: Interaction): Promise<void> {
    await interaction.reply('pong');
  }
}

export default new Ping();
