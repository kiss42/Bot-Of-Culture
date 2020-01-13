const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const bot = new CommandoClient({
    commandPrefix: '!',
    owner: '490292237339590706',
    // invite: 'https://discord.gg/bRCvFy9' This will be the link to the bot's support server when it goes public
});

// Registers path to the command folder and associated command group
// Simply add another folder and matching entry to the register groups to create a new group
bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ['text', 'Commands for text responses to messages'],
        ['music', 'Commands for handling music in the channel'],        
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

//This must be kept secret and is stored using an ignored ".env" file
//For server use, the token is stored in heroku for hosting
const BOT_SECRET_LOGIN = process.env.BOT_SECRET_LOGIN; 

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
bot.once('ready', () => {
    console.log("I AM HERE!");
    console.log(`${bot.user.username} reporting for duty!`);
    bot.user.setActivity('Commando');
});

bot.on('error', console.error);

// An event listener for messages --- Deprecated now that the bot is using the Commando framework
// TO-DO: Convert these commands to Commando-style setup
bot.on('message', message => {
    //If the message starts with the correct prefix and didn't come from the bot...
    if (message.content.startsWith(PREFIX) && message.author.id != bot.user.id) {
        // Split the message into substring containing the message following the command prefix
        const args = message.content.substring(PREFIX.length).split(/ +/);
        const command = args.shift().toLowerCase();
        switch(command){
            case 'ping':
                message.reply("pong!")
                break;
            case 'vic':
                message.channel.send("GUUUUUUUIIIILTYYYYYY!");
                break;
            default:
                message.channel.send("Sorry, I don't recognize that command");
        }
    }
});

//Logs the Bot into Discord using the Bot's authorization token/login
bot.login(BOT_SECRET_LOGIN);

//Use 'npm start' in the terminal to start the application (The Bot will appear online and send a message to the console)
//Use 'ctrl + c' to stop running the program! Or else you'll run multiple instances of the script!

// TODO: Add feature that allows scheduling/entering events, and commands to retrieve event information such as guests, data, location