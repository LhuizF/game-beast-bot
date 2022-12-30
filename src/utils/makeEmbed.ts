import { EmbedBuilder } from 'discord.js';
import { clientBot } from '../server';

const messageType = {
  error: {
    color: 0xff0000,
    title: 'Error ❌'
  },
  success: {
    color: 0x00ff00,
    title: 'Success ✅'
  },
  info: {
    color: 0x0000ff,
    title: 'Info ℹ️'
  },
  warn: {
    color: 0xffff00,
    title: 'Warning ⚠️'
  },
  log: {
    color: 0x404040,
    title: 'LOG 📝'
  }
};

type EmbedMessage = EmbedBuilder[];

interface Message {
  description: string;
  showTime?: boolean;
  footer?: boolean;
}

interface MessageWithType extends Message {
  type: keyof typeof messageType;
}

interface CustomMessage extends Message {
  color: number;
  title: string;
}

// Overload
export function makeEmbed(data: MessageWithType): EmbedMessage;
export function makeEmbed(data: CustomMessage): EmbedMessage;

export function makeEmbed(data: unknown): EmbedMessage {
  const messageConfig = getMessageConfig(data);

  const embed = new EmbedBuilder()
    .setColor(messageConfig.color)
    .setTitle(messageConfig.title)
    .setDescription(messageConfig.description);

  if (messageConfig.showTime) embed.setTimestamp();

  if (messageConfig.footer) {
    const client = clientBot.getClient();
    const avatarURL = client?.user?.avatarURL();
    const username = client?.user?.username;

    if (avatarURL && username) {
      embed.setFooter({ text: username, iconURL: avatarURL });
    }
  }

  return [embed];
}

const getMessageConfig = (data: unknown): CustomMessage => {
  if ((data as MessageWithType).type in messageType) {
    const messageWithType = data as MessageWithType;
    const { color, title } = messageType[messageWithType.type];

    // const message = { ...messageWithType } as any;
    // delete message.type;

    return { color, title, ...messageWithType };
  } else {
    return data as CustomMessage;
  }
};
