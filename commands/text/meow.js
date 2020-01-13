const { Command } = require('discord.js-commando');

module.exports = class Meowcommand extends Command {
    /**
     * Constructsthis command and its relative information
     * @param {Discord.Client} client The bot that is running this command
     * Name - Name of the command
     * Aliases - Other ways the command can be called
     * Group - He command group that this command is a part of
     * MemberName - the name of the command within the group
     * Description - the help text displayed when the help command is used
     */
    constructor(client) {
        super(client, {
            name: 'meow',
            aliases: ['kitty-cat'],
            group: 'text',
            memberName: 'meow',
            description: 'Replies with a meow, kitty cat.',
        });
    }

    run(message) {
        return message.say('Meow!');
    }
};