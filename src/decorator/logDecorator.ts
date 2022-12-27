import { Command, Interaction } from '../types/protocols/command';
import { sendLog } from '../utils/helpers';

export class LogDecorator implements Command {
  name = '';
  description = '';
  options;
  constructor(private readonly command: Command) {
    this.name = command.name;
    this.description = command.description;
    this.options = command.options;
  }
  async handle(interaction: Interaction): Promise<void> {
    await interaction.deferReply();

    const text = [
      '`Usuário:` ' + `${interaction.user.tag} / ${interaction.user.id}`,
      '`Servidor:` ' + `${interaction.guild?.name} / ${interaction.guild?.id}`,
      '`Canal:` ' + `${interaction.channel?.name} / ${interaction.channel?.id}`,
      '`Comando:`' + `${this.name} / Opções ${interaction.options.data}`,
      '`Data:`' + ` ${new Date().toLocaleString('pt-BR')}`
    ];

    sendLog(interaction, text.join('\n'));

    await this.command.handle(interaction);
  }
}
