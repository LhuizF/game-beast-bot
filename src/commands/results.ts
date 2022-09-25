import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { GameResult } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';
import { makeFieldInline } from '../utils';

class Results implements Command {
  readonly name = 'resultados';
  readonly description = 'Mostra o resultado dos últimos 3 jogos';
  readonly options = [
    {
      name: 'max',
      description: 'Quantidade máxima de resultados dos últimos (max 8)',
      type: 4
    }
  ];

  async handle(interaction: Interaction): Promise<void> {
    const [maxOption] = interaction.options.data;

    const max: string = (() => {
      if (!maxOption?.value) return '3';
      if (maxOption.value > 10 || maxOption.value <= 0) return '3';
      return maxOption.value.toString();
    })();

    const games = await local
      .get<GameResult[]>(`/last-games?max=${max}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!games) return;

    const headEmbed = new EmbedBuilder()
      .setTitle(`Últimos ${games.length} resultados`)
      .setColor([245, 73, 53])
      .setFooter({ text: 'Game beast' });

    const embed = games.map((game) => {
      const totalPoints = game.winners.reduce((acc, win) => acc + win.pointsReceived, 0);

      return new EmbedBuilder()
        .setTitle(`Game número ${game.id_game}`)
        .setColor([245, 73, 53])
        .addFields(
          makeFieldInline('Resultado', game.beastWin?.name || '', false),
          makeFieldInline('Total de apostas', game.totalBets.toString()),
          makeFieldInline('Total de ganhadores', game.winners.length.toString()),
          makeFieldInline('Total pontos ganhos', totalPoints)
        )
        .setTimestamp(new Date(game.date));
    });

    await interaction.reply({ embeds: [headEmbed, ...embed] });
  }
}

export default new Results();
