import { Guild } from 'discord.js';
import { ClientBot } from '../config/client';
import { Bot } from '../types/protocols/bot';
import { createChannel } from '../utils';
import api from '../services/api';
import { GuildModel } from '../types/api';

export class BotDecorator implements Bot {
  constructor(private readonly clientBot: ClientBot) {}

  async start(): Promise<void> {
    await this.clientBot.start(this.clientBot.token);
    const client = this.clientBot.getClient();

    client.on('guildCreate', async (guild: Guild) => {
      const channel = await createChannel(guild, client.user?.id || '');

      const guildInDb = await api.post<GuildModel>('/create-guild', {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        channel: channel.id
      });

      if (guildInDb instanceof Error) {
        // log de error
        return;
      }
    });
  }
}
