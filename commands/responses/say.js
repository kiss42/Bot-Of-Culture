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
            name: 'say',
            aliases: ['parrot', 'copy'],
            group: 'responses',
            memberName: 'say',
            description: 'Replies with the text you provide.',
            args: [
                // The arguments necessary for this command. More than one can be added
                // key - name of the argument
                // prompt - text that displays if there is no argument (encouraging the user to provide one)
                // type - the type of argument that should be provided
                {
                    key: 'text',
                    prompt: 'What would you like me to say?',
                    type: 'string',
                },
            ],
        });
    }

    // Repeats whatever the user repeats
    async run(message, {text}) {
        return message.reply(text);
    }
};