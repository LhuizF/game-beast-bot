import { Status } from '../types/api';

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
