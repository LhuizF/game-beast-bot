import { EmbedBuilder, TextChannel } from 'discord.js';
import { ptbr as translator } from '../langs';
import { RequestError } from '../errors';
import { Status } from '../types/types';
import { Interaction } from '../types/protocols/command';

export const makeFieldInline = (name: string, value: string | number, inline = true) => ({
  name,
  value: `**${value.toString() || ''}**`,
  inline
});

export const getStatus = (status: Status): string => {
  const statusType = {
    pending: 'pendente',
    win: 'ganhou',
    lose: 'perdeu'
  };

  return statusType[status];
};

// eslint-disable-next-line
export const handleError = async (interaction: Interaction, error: RequestError): Promise<void> => {
  const message = translator[error.message as keyof typeof translator] || 'Erro interno';

  const text = JSON.stringify(error);

  sendLog(interaction, text);

  const embed = new EmbedBuilder().setTitle(message);

  await interaction.editReply({ embeds: [embed] });
};

export const time = {
  1: 'Manha',
  2: 'Tarde',
  3: 'Noite'
};

export const sendLog = (interaction: Interaction, message: string): void => {
  const { client } = interaction;
  const channelId = process.env.CHANNEL_LOG as string;

  const channel = client.channels.cache.get(channelId) as TextChannel;

  const embed = new EmbedBuilder().setTitle('LOG 💾').setDescription(message);

  channel.send({ embeds: [embed] });
};
