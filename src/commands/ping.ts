import api from '../services/api';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';

class Ping implements Command {
  name = 'ping';
  description = 'Replies with Pong!';
  async handle(interaction: Interaction): Promise<void> {
    const s = await api.get<{ status: string }>('/status');
    if (s instanceof Error) {
      await handleError(interaction, s);
      return;
    }

    await interaction.reply(`ping ${s.status}`);
  }
}

export default new Ping();
