import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { GameResult } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { handleError, makeFieldInline } from '../utils';
import { time } from '../utils/helpers';

class Results implements Command {
  name = 'resultados';
  description = 'Mostra o resultado dos últimos 3 jogos';
  options: [
    {
      name: 'max';
      description: 'Quantidade máxima de resultados dos últimos (max 8)';
      type: 4;
    }
  ];

  async handle(interaction: Interaction): Promise<void> {
    const [maxOption] = interaction.options.data;

    const max: string = (() => {
      if (!maxOption?.value) return '3';
      if (maxOption.value > 8 || maxOption.value <= 0) return '3';
      return maxOption.value.toString();
    })();

    const results = await api.get<GameResult[]>(`/last-games?max=${max}`);

    if (results instanceof Error) {
      await handleError(interaction, results);
      return;
    }

    if (results.length === 0) {
      const embed = new EmbedBuilder()
        .setColor([245, 73, 53])
        .setTitle('Não há resultados disponíveis');

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const headEmbed = new EmbedBuilder()
      .setTitle(`Últimos ${results.length} resultados`)
      .setColor([245, 73, 53]);
    // .setFooter({ text: 'Game beast' });

    const embed = results.map((result) => {
      const totalPoints = result.winners.reduce(
        (acc, win) => acc + win.pointsReceived,
        0
      );

      const date = new Date(result.game.created_at).toLocaleString().split(' ')[0];
      const gameTime = time[result.game.time as keyof typeof time];

      return new EmbedBuilder()
        .setTitle(`Game número ${result.game.id}`)
        .setColor([245, 73, 53])
        .setFooter({ text: `DIa: ${date} Horário: ${gameTime}` })
        .setDescription(
          `O número sorteado foi o **${result.beastWin?.id} ${result.beastWin?.name}**`
        )
        .addFields(
          makeFieldInline('Total de apostas', result.totalBets),
          makeFieldInline('Total de ganhadores', result.winners.length),
          makeFieldInline('Total pontos ganhos', totalPoints)
        );
    });

    await interaction.editReply({ embeds: [headEmbed, ...embed] });
  }
}

export default Results;
