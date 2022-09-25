import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { BetModel } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';
import { getBeastName, getStatus, makeFieldInline } from '../utils';

class LestBetsUser implements Command {
  readonly name = 'minhasapostas';
  readonly description = 'Mostra suas últimas apostas';
  readonly options = [
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

    const userBets = await local
      .get<BetModel[]>(`/user/${id_guild}/${user.id}/bets?max=${max}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!userBets) return;

    const headEmbed = new EmbedBuilder()
      .setTitle(`Últimos ${userBets.length} apostas de ${user.username}`)
      .setColor([245, 73, 53])
      .setFooter({ text: 'Game beast' });

    const embed = userBets.map((bet) => {
      return new EmbedBuilder()
        .setTitle(`Game número ${bet.id_game}`)
        .setColor([245, 73, 53])
        .addFields(
          makeFieldInline('Você apostou no', getBeastName(bet.id_beast)),
          makeFieldInline('Pontos', bet.points),
          makeFieldInline('Status', getStatus(bet.status))
        )
        .setTimestamp(new Date(bet.created_at));
    });

    await interaction.reply({ embeds: [headEmbed, ...embed] });
  }
}

export default new LestBetsUser();
