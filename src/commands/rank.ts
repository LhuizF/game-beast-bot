import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { UserModel } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';
import { makeEmbed } from '../utils/makeEmbed';
import formatTable from '../utils/formatTable';

interface RankDescription {
  position: string[];
  name: string[];
  points: string[];
}

class Rank implements Command {
  name = 'rank';
  description = 'Veja os 5 jogadores com mais pontos no servido atual';
  options = [
    {
      name: 'global',
      description:
        'Veja os 5 jogadores com mais pontos em todos os servidores que o bot esta',
      type: 5
    }
  ];

  async handle(interaction: Interaction): Promise<void> {
    const options = interaction.options.data;

    const isGlobal = options.length > 0 ? !!options[0].value : false;
    const id_guild = interaction.guildId as string;

    const params = !isGlobal ? { server: id_guild } : undefined;

    const usersRank = await api.get<UserModel[]>('/rank', { params });

    if (usersRank instanceof Error) {
      await handleError(interaction, usersRank);
      return;
    }

    const description = [['Posição', 'Nome', 'Pontos']];
    const medalEmojis = ['🥇', '🥈', '🥉'];
    const defaultMedal = '🏅';
    usersRank.forEach((user, index) => {
      const isMedal = index < 3;
      const position = `${isMedal ? medalEmojis[index] : defaultMedal} ${index + 1}º | `;
      const name = user.name;
      const points = user.points.toString();
      description.push([position, name, points]);
    });

    const embed = makeEmbed({
      type: 'info',
      title: `Top 5 jogadores ${!isGlobal ? 'do Servidor' : ''}`,
      description: formatTable(description)
    });

    await interaction.editReply({ embeds: embed });
  }
}

export default Rank;
