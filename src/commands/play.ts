import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { UserModel } from '../types/api';
import { Command, Interaction } from '../types/protocols/commands';

class Play implements Command {
  readonly name = 'jogar';
  readonly description = 'Crie uma conta para começar a jogar agora!';
  async handle(interaction: Interaction): Promise<void> {
    const data = {
      name: interaction.user.username,
      id_guild: interaction.guildId,
      id_discord: interaction.user.id,
      avatar: interaction.user.avatarURL()
    };

    const user = await local
      .post<UserModel>('/singup', data)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!user) {
      await interaction.reply('Ocorreu um erro na criação so seu usuário :(');
      return;
    }

    const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
    const role = interaction.guild?.roles.cache.filter((r) => r.name == 'Player');

    if (!role || !guildMember) return;
    await guildMember.roles.add(role);

    const embed = new EmbedBuilder({
      title: `${user.name} começou a jogar!`
    })
      .setColor([245, 73, 53])
      .setThumbnail(user.avatar)
      .addFields({ name: 'Pontos iniciais', value: user.points.toString(), inline: true })
      .setTimestamp()
      .setFooter({ text: 'Game beast' });

    await interaction.reply({ embeds: [embed] });
  }
}

export default new Play();
