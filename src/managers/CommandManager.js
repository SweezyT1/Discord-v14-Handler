import { readdir } from 'node:fs/promises';
import { Collection } from 'discord.js';

export class CommandManager {
  constructor(client) {
    this.client = client;
    this.manager = new Collection();
  }

  async loadCommands(client) {
    const categories = await readdir('./commands/');
    for await (const category of categories) {
      const commands = await readdir(`./commands/${category}`);

      for await (const command of commands) {
        if (!command.endsWith('.js')) continue;
        const commandWithoutExtension = command.replace('.js', '');
        const { default: CommandClass } = await import(`../commands/${category}/${command}`);
        const cmd = new CommandClass(client);
        this.manager.set(commandWithoutExtension, cmd);
      }
    }
  }

  getCommand(commandName) {
    return this.manager.get(commandName);
  }

  async registerCommands() {
    const commandsS = this.client.commands.manager.map(x => x.options);

    if (process.env.NODE_ENV?.trim() === 'development') {
      await this.client.guilds.cache.get(process.env.GUilD_ID).commands.set(commandsS).then(() => this.client.logger.info('Application commands [/] reloaded successfully', {
        tags: ['Register']
      }));
    } else {
      await this.client.application.commands.set(commandsS).then(() => this.client.logger.info('Successfully reloaded application [/] commands', {
        tags: ['Register']
      }));
    }

    this.client.logger.info(`Were uploaded ${commandsS.length} commands on discord`, {
      tags: ['Register'],
    });
  }
}
