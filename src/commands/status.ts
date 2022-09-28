import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { UserModel } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';

class Status implements Command {
  name = 'status';
  description = 'Veja os detalhes da sua conta';
  async handle(interaction: Interaction): Promise<void> {
    const guildID = interaction.guildId;
    const userDiscord = interaction.user;

    const user = await local
      .get<UserModel>(`guild/${guildID}/user/${userDiscord.id}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });

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
        { name: 'Criado', value: newDate }
      )
      .setTimestamp()
      .setFooter({ text: 'Game beast' });

    await interaction.reply({ embeds: [embed] });
  }
}

export default new Status();
