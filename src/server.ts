import 'dotenv/config';
import { bot } from './config/client';

bot.login(process.env.DISCORD_TOKEN || '');
