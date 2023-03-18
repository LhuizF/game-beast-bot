import api from '../services/api';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';
import { makeEmbed } from '../utils/makeEmbed';

class Ping implements Command {
  name = 'ping';
  description = 'Replies with Pong!';
  async handle(interaction: Interaction): Promise<void> {
    // const s = await api.get<{ status: string }>('/status');

    // if (s instanceof Error) {
    //   await handleError(interaction, s);
    //   return;
    // }


    const embeds = makeEmbed({
      color: 0x404040,
      title: 'Pong! 🥎',
      disableFooter: true
    });

    await interaction.editReply({ embeds });
  }
}

export default Ping;
