import { EmbedBuilder } from 'discord.js';
import api from '../services/api';
import { UserModel } from '../types/types';
import { Command, Interaction } from '../types/protocols/command';
import { handleError } from '../utils';
import { makeEmbed } from '../utils/makeEmbed';

class Play implements Command {
  name = 'jogar';
  description = 'Crie uma conta para começar a jogar agora!';

  async handle(interaction: Interaction): Promise<void> {
    const data = {
      name: interaction.user.tag,
      id_guild: interaction.guildId,
      id_discord: interaction.user.id,
      avatar: interaction.user.avatarURL()
    };

    const user = await api.post<UserModel>('/singup', { ...data });

    if (user instanceof Error) {
      await handleError(interaction, user);
      return;
    }
    if (!user) {
      await interaction.editReply('Ocorreu um erro na criação so seu usuário :(');
      return;
    }

    const guildMember = interaction.guild?.members.cache.get(interaction.user.id);
    const role = interaction.guild?.roles.cache.find((r) => r.id === user.roleId);

    if (!role || !guildMember) return;
    await guildMember.roles.add(role);

    const embeds = makeEmbed({
      type: 'success',
      title: `${interaction.user.username} começou a jogar!`,
      description: `Pontos iniciais: ${user.points}`
    });

    await interaction.editReply({ embeds });
  }
}

export default Play;
