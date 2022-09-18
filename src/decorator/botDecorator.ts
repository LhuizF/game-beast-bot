import { Guild } from 'discord.js';
import { ClientBot } from '../config/client';
import { Bot } from '../protocols/bot';
import { createChannel } from '../service/createChannel';
import { local } from '../services/api';

export class BotDecorator implements Bot {
  constructor(private readonly clientBot: ClientBot) { }

  async start(token: string): Promise<void> {
    await this.clientBot.start(token);
    const client = this.clientBot.getClient();

    client.on('guildCreate', async (guild: Guild) => {
      const channelID = await createChannel(guild, client.user?.id || '');

      await local
        .post('/create-guild', {
          id: Number(guild.id),
          name: guild.name,
          icon: guild.icon,
          channel: channelID
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.data));
    });
  }
}
