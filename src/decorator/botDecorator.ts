import { Guild } from 'discord.js';
import { ClientBot } from '../config/client';
import { Bot } from '../types/protocols/bot';
import { createChannel } from '../utils';
import api from '../services/api';
import { GuildModel } from '../types/types';

export class BotDecorator implements Bot {
  constructor(private readonly clientBot: ClientBot) {}

  async start(): Promise<void> {
    await this.clientBot.start(this.clientBot.token);
    const client = this.clientBot.getClient();

    client.on('guildCreate', async (guild: Guild) => {
      const { channelId, roleId } = await createChannel(guild, client.user?.id || '');

      const guildInDb = await api.post<GuildModel>('/create-guild', {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        channel: channelId,
        role: roleId,
        withToken: true
      });

      if (guildInDb instanceof Error) {
        // log de error
        return;
      }
    });

    client.on('guildDelete', async (guild: Guild) => {
      const oldGuild = await api.put<GuildModel>(`/disable-guild/${guild.id}`);

      if (oldGuild instanceof Error) {
        // log de error
        return;
      }

      // const roles = guild.roles.cache;

      // const role = roles.find((r) => r.name === 'Player');
      // role && role.delete();

      // const channel = guild.channels.cache.get(oldGuild.channel);
      // channel && channel.delete();

      // const category = channel?.parent;
      // category && category.delete();
    });
  }
}
