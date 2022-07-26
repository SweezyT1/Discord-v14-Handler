import { Event } from '../structures/Event.js';
import { EmbedBuilder } from 'discord.js';

export default class MessageCreate extends Event {
  constructor() {
    super();
    this.eventName = 'messageCreate';
  }

  execute(client, message) {
    if (message.author.bot) return;
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('> You can see all my commands using `/help`'),
        ],
      });
    }
  }
}
