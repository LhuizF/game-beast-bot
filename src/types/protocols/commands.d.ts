import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export type Interaction = ChatInputCommandInteraction<CacheType>;

export interface Command {
  readonly name: string;
  readonly description: string;
  readonly options?: Array<any>; //
  handle(interaction: Interaction): Promise<void>;
}
