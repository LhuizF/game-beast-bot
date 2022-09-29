import axios, { AxiosError } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { local } from '../services/api';
import { MessageError, NewBet } from '../types/api';
import { Command, Interaction } from '../types/protocols/command';
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

    const id_guild = interaction.guildId;
    const user = interaction.user;

    const bet = await local
      .post<NewBet>(`/bet`, {
        id_guild,
        id_discord: user.id,
        id_beast: beast.value,
        points: points.value,
        platform: 'discord'
      })
      .then((res) => res.data)
      .catch((err: AxiosError) => {
        return err;
      });

    if (bet instanceof Error) {
      const response = bet.response?.data as MessageError;

      if (response.mensagem === 'user not found') {
        const embed = new EmbedBuilder().setTitle(
          'Para começar a jogar utilize o comando `/jogar`'
        );

        await interaction.reply({ embeds: [embed] });
        return;
      }

      await interaction.reply(response.mensagem);
      return;
    }

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
