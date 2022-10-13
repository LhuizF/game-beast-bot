import { EmbedBuilder } from 'discord.js';
import { ptbr as translator } from '../langs';
import { RequestError } from '../services/api';
import { Status } from '../types/api';
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

  const embed = new EmbedBuilder().setTitle(message);

  await interaction.reply({ embeds: [embed] });
};
