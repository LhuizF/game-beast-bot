import 'dotenv/config';
import { ClientBot } from './config/client';
import { BotDecorator } from './decorator/botDecorator';

const token = process.env.DISCORD_TOKEN || '';
const clientID = process.env.CLIENT_ID || '';

const clientBot = new ClientBot(token, clientID);

const bot = new BotDecorator(clientBot);

bot.start();
