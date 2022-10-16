import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { NewBet } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';
import { getBeastOptions, handleError } from '../utils';

const toBet: Command = {
  name: 'apostar',
  description: 'Aposte seus pontos agora!',
  options: [
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
  ],

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

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} acabou de apostar!`)
      .setColor([245, 73, 53])
      .addFields(
        { name: 'Pontos', value: bet.points.toString(), inline: true },
        { name: 'Animal', value: bet.beast, inline: true }
      )
      .setTimestamp();
    // .setFooter({ text: 'Game beast' });

    await interaction.reply({ embeds: [embed] });
  }
};

export default toBet;
