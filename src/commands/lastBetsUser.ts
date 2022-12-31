import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { BetModel } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { getBeastName, getStatus, handleError, makeFieldInline } from '../utils';
import { makeEmbed } from '../utils/makeEmbed';

class LestBetsUser implements Command {
  name = 'minhasapostas';
  description = 'Mostra suas últimas apostas';
  options = [
    {
      name: 'max',
      description: 'Quantidade máxima de apostas dos últimos (max 5)',
      type: 4
    }
  ];

  async handle(interaction: Interaction): Promise<void> {
    const [maxOption] = interaction.options.data;

    const max: string = (() => {
      if (!maxOption?.value || maxOption.value > 10 || maxOption.value <= 0) return '3';
      return maxOption.value.toString();
    })();

    const id_guild = interaction.guildId;
    const user = interaction.user;

    const userBets = await api.get<BetModel[]>(
      `/guild/${id_guild}/user/${user.id}/bets`,
      { params: { max } }
    );

    if (userBets instanceof Error) {
      await handleError(interaction, userBets);
      return;
    }

    if (userBets.length === 0) {
      const embeds = makeEmbed({
        type: 'warn',
        description: `${user.username} ainda não fez nenhuma aposta`
      });

      await interaction.editReply({ embeds });
      return;
    }

    const embeds = userBets.map((bet: BetModel) => {
      const beast = getBeastName(bet.id_beast);
      const [date, time] = new Date(bet.created_at).toLocaleString().split(' ');

      const betGame = [
        `---------------------------------------------`,
        `| Game #${bet.id_game} - ${date}`,
        `| ${user.username} apostou ${bet.points} pontos no ${beast} - ${bet.id_beast}`,
        `| Status: ${getStatus(bet.status)}`
      ];

      return betGame.join('\n');
    });

    const headEmbed = makeEmbed({
      type: 'success',
      title: `Últimas ${userBets.length} apostas de ${user.username}`,
      description: embeds
    });

    await interaction.editReply({ embeds: headEmbed });
  }
}

export default LestBetsUser;
