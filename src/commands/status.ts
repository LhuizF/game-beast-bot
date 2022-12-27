import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { UserModel } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';

class Status implements Command {
  name = 'status';
  description = 'Veja os detalhes da sua conta';

  async handle(interaction: Interaction): Promise<void> {
    const guildID = interaction.guildId;
    const userDiscord = interaction.user;

    const user = await api.get<UserModel>(`guild/${guildID}/user/${userDiscord.id}`);

    if (user instanceof Error) {
      await handleError(interaction, user);
      return;
    }

    if (!user) return;
    const [createAt] = user.created_at.toString().split('T');
    const newDate = createAt.split('-').reverse().join('-');

    const embed = new EmbedBuilder()
      .setTitle(userDiscord.tag)
      .setColor([245, 73, 53])
      .setThumbnail(user.avatar)
      .addFields(
        { name: 'Nome', value: user.name, inline: true },
        { name: 'Pontos atuais', value: user.points.toString(), inline: true },
        { name: 'Criado em', value: newDate.replace(/-/g, '/') }
      )
      .setTimestamp();
    // .setFooter({ text: 'Game beast' });

    await interaction.editReply({ embeds: [embed] });
  }
}

export default Status;
