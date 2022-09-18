import 'dotenv/config';
import { clientBot } from './config/client';
import { BotDecorator } from './decorator/botDecorator';

const bot = new BotDecorator(clientBot);

bot.start(process.env.DISCORD_TOKEN || '');
