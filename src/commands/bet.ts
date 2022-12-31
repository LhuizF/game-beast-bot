import api from '../services/api';
import { NewBet } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { getBeastOptions, handleError } from '../utils';
import { makeEmbed } from '../utils/makeEmbed';

class ToBet implements Command {
  name = 'apostar';
  description = 'Aposte seus pontos agora!';
  options = [
    {
      name: 'pontos',
      description: 'Quantidade de pontos que deseja apostar',
      type: 4,
      required: true
    },
    {
      name: 'animal',
      description: 'Animal que deseja apostar',
      type: 4,
      required: true,
      choices: getBeastOptions()
    }
  ];

  async handle(interaction: Interaction): Promise<void> {
    const [points, beast] = interaction.options.data;

    const id_guild = interaction.guildId || '';
    const user = interaction.user;

    const bet = await api.post<NewBet>(`/bet`, {
      id_guild: id_guild,
      id_discord: user.id,
      id_beast: beast.value,
      points: points.value,
      platform: 'discord'
    });

    if (bet instanceof Error) {
      await handleError(interaction, bet);
      return;
    }

    const message = [
      `Animal: ${bet.beast}`,
      `Pontos: ${bet.points}`
      // multiplicador do game atual e quanto vai ganhar
    ];

    const embeds = makeEmbed({
      type: 'success',
      title: `${user.username} acabou de apostar!`,
      description: message
    });

    await interaction.editReply({ embeds });
  }
}

export default ToBet;
