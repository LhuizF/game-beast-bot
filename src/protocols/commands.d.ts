import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export type Interaction = ChatInputCommandInteraction<CacheType>;

export interface Command {
  name: string;
  description: string;
  handle(interaction: Interaction): Promise<void>;
}
