import { Guild } from 'discord.js';
import { ClientBot } from '../config/client';
import { Bot } from '../types/protocols/bot';
import { createChannel } from '../utils';
import { local } from '../services/api';
import { GuildModel } from '../types/api';

export class BotDecorator implements Bot {
  constructor(private readonly clientBot: ClientBot) {}

  async start(token: string): Promise<void> {
    await this.clientBot.start(token);
    const client = this.clientBot.getClient();

    client.on('guildCreate', async (guild: Guild) => {
      const channel = await createChannel(guild, client.user?.id || '');

      const guildInDb = await local
        .post<GuildModel>('/create-guild', {
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL(),
          channel: channel.id
        })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return null;
        });

      // if (!guildInDb) return;

      // channel.send({embeds: })
    });
  }
}
