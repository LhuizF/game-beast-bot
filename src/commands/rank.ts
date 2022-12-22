import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { UserModel } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';

const rank: Command = {
  name: 'rank',
  description: 'Veja os 5 jogadores com mais pontos no servido atual',
  options: [
    {
      name: 'global',
      description:
        'Veja os 5 jogadores com mais pontos em todos os servidores que o bot esta',
      type: 5
    }
  ],

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

    const rank = usersRank.map((user, index) => {
      const position = `${index + 1}º`;

      return new EmbedBuilder()
        .addFields(
          { name: 'Posição', value: position, inline: true },
          { name: 'Nome', value: user.name, inline: true },
          { name: 'pontos', value: user.points.toString(), inline: true }
        )
        .setThumbnail(user.avatar);
    });

    const embed = new EmbedBuilder()
      .setTitle(`Top 5 jogadores ${isGlobal && 'Global'}`)
      .setColor([245, 73, 53])
      .setTimestamp();

    if (!isGlobal) embed.setDescription(`Server: **${interaction.guild?.name}**`);

    await interaction.reply({ embeds: [embed, ...rank] });
  }
};

export default rank;
