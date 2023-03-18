import { EmbedBuilder } from 'discord.js';

const messageType = {
  error: {
    color: 0xff0000,
    message: 'Error ❌'
  },
  success: {
    color: 0x00ff00,
    message: 'Success ✅'
  },
  info: {
    color: 0x0000ff,
    message: 'Info ℹ️'
  },
  warn: {
    color: 0xffff00,
    message: 'Warning ⚠️'
  },
  log: {
    color: 0x404040,
    message: 'LOG 📝'
  }
};

type EmbedMessage = EmbedBuilder[];

interface Message {
  description?: string | string[];
  time?: Date;
  disableFooter?: boolean;
}

interface MessageWithType extends Message {
  type: keyof typeof messageType;
  title?: string;
}

interface CustomMessage extends Message {
  color: number;
  title: string;
}

interface MessageConfig extends CustomMessage {
  title: string;
  footer?: string;
}

// Overload
export function makeEmbed(data: MessageWithType): EmbedMessage;
export function makeEmbed(data: CustomMessage): EmbedMessage;

export function makeEmbed(data: unknown): EmbedMessage {
  const messageConfig = getMessageConfig(data);

  const embed = new EmbedBuilder()
    .setColor(messageConfig.color)
    .setTitle(messageConfig.title);

  if (messageConfig.description || !!messageConfig.description?.length) {
    const description = Array.isArray(messageConfig.description)
      ? messageConfig.description.join('\n')
      : messageConfig.description;

    const descriptionTemplate = '```' + description + '```';

    embed.setDescription(descriptionTemplate);
  }

  if (!messageConfig.disableFooter) {
    embed.setTimestamp(messageConfig.time);
  }

  if (messageConfig.footer) {
    embed.setFooter({ text: messageConfig.footer });
  }

  return [embed];
}

const getMessageConfig = (data: unknown): MessageConfig => {
  if ((data as MessageWithType).type in messageType) {
    const messageWithType = data as MessageWithType;
    const { color, message } = messageType[messageWithType.type];

    const title = messageWithType.title || message;
    const footer = messageWithType.title ? message : '';

    return { color, title, footer, ...messageWithType };
  } else {
    return data as CustomMessage;
  }
};
