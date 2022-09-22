import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { BetModel } from '../types/api';
import { Command, Interaction } from '../types/protocols/commands';
import { getBeastOptions } from '../utils';

class ToBet implements Command {
  readonly name = 'apostar';
  readonly description = 'Aposte seus pontos agora!';
  readonly options = [
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

    const guildID = interaction.guildId;
    const user = interaction.user;

    const bet = await local
      .post<BetModel>(`/bet/${guildID}/${user.id}`, {
        id_beast: beast.value,
        points: points.value,
        platform: 'discord'
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!bet) return;

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} acabou de apostar!`)
      .setColor([245, 73, 53])
      .addFields(
        { name: 'Pontos', value: bet.points.toString(), inline: true },
        { name: 'Animal', value: bet.beast, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Game beast' });

    await interaction.reply({ embeds: [embed] });
  }
}

export default new ToBet();
