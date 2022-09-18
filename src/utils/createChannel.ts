import { ChannelType, Guild, TextChannel } from 'discord.js';

export const createChannel = async (guild: Guild, id: string): Promise<TextChannel> => {
  const role = await guild.roles.create({
    name: 'Player',
    color: 'Red',
    mentionable: true
  });

  const category = await guild.channels.create({
    name: 'Game Beast Bot',
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      { id, allow: ['SendMessages', 'ViewChannel', 'Administrator'] },
      {
        id: guild.roles.everyone,
        allow: [],
        deny: [
          'ViewChannel',
          'SendMessages',
          'UseExternalEmojis',
          'SendMessagesInThreads',
          'SendTTSMessages',
          'CreatePublicThreads',
          'CreatePrivateThreads',
          'AddReactions'
        ]
      },
      {
        id: role.id,
        allow: ['ViewChannel', 'AddReactions'],
        deny: [
          'SendMessages',
          'UseExternalEmojis',
          'SendMessagesInThreads',
          'SendTTSMessages',
          'CreatePublicThreads',
          'CreatePrivateThreads'
        ]
      }
    ]
  });

  const channel = await category.children.create({
    name: 'Resultados',
    topic: 'Resultado dos jogos aqui todos os dias às 10hs, 15hs e 20hs'
  });

  return channel;
};
