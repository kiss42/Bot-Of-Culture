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
     * Throttling - Controls how many times this command can be used within a given duration
     * guildOnly - Whether this command can only be used within a server
     */
    constructor(client) {
        super(client, {
            name: 'meow',
            aliases: ['kitty-cat'],
            group: 'responses',
            memberName: 'meow',
            description: 'Replies with a meow, kitty cat.',
            throttling: {
                usages: 2,
                duration: 10,
            },
            guildOnly: false,
        });
    }

    run(message) {
        return message.say('Meow!');
    }
};