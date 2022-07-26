import { Event } from '../structures/Event.js';
import { presence } from '../config/settings.js';
import { Activity } from 'discord.js';

export default class Ready extends Event {
  constructor() {
    super();
    this.eventName = 'ready';
  }

  async execute(client) {
    const statuses = presence;

    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status, { type: Activity.Playing });
    }, 10000);

    client.logger.info(`The connection was successful with ${client.user.tag}`, { tags: ['Ready'] });

    client.on('error', (err) => client.logger.error(err, { tags: ['Bot'] }));
    process.on('unhandledRejection', (err) => client.logger.error(err, { tags: ['Process'] }));
    process.on('uncaughtException', (err) => client.logger.error(err, { tags: ['Process'] }));

    await client.commands.registerCommands();
  }
}
