import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { GameResult } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { handleError, makeFieldInline } from '../utils';

const results: Command = {
  name: 'resultados',
  description: 'Mostra o resultado dos últimos 3 jogos',
  options: [
    {
      name: 'max',
      description: 'Quantidade máxima de resultados dos últimos (max 8)',
      type: 4
    }
  ],

  async handle(interaction: Interaction): Promise<void> {
    const [maxOption] = interaction.options.data;

    const max: string = (() => {
      if (!maxOption?.value) return '3';
      if (maxOption.value > 10 || maxOption.value <= 0) return '3';
      return maxOption.value.toString();
    })();

    const games = await api.get<GameResult[]>(`/last-games?max=${max}`);

    if (games instanceof Error) {
      await handleError(interaction, games);
      return;
    }

    const headEmbed = new EmbedBuilder()
      .setTitle(`Últimos ${games.length} resultados`)
      .setColor([245, 73, 53]);
    // .setFooter({ text: 'Game beast' });

    const embed = games.map((game) => {
      const totalPoints = game.winners.reduce((acc, win) => acc + win.pointsReceived, 0);

      return new EmbedBuilder()
        .setTitle(`Game número ${game.id_game}`)
        .setColor([245, 73, 53])
        .addFields(
          makeFieldInline('Resultado', game.beastWin?.name || '', false),
          makeFieldInline('Total de apostas', game.totalBets),
          makeFieldInline('Total de ganhadores', game.winners.length),
          makeFieldInline('Total pontos ganhos', totalPoints)
        )
        .setTimestamp(new Date(game.date));
    });

    await interaction.reply({ embeds: [headEmbed, ...embed] });
  }
};

export default results;
