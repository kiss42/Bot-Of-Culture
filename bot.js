const Discord = require('discord.js');
const bot = new Discord.Client();
//This must be kept secret and is stored using an ignored ".env" file
//For server use, the token is stored in heroku for hosting
const BOT_SECRET_LOGIN = process.env.BOT_SECRET_LOGIN; 

//Prefix that precedes a command
const PREFIX = '!';

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
bot.on('ready', () => {
    console.log("I AM HERE!");
    console.log(`${bot.user.username} reporting for duty!`);
});

//An event listener for messages
bot.on('message', message => {
   
    // Split the message into substrings with one containing the prefix, and the rest containing the message content
    let args = message.content.substring(PREFIX.length).split(" ");

    //If the message starts with the correct prefix and didn't come from the bot...
    if (message.author.id != bot.user.id && args[0] == PREFIX) {
        //Switch instruction case based on given command
        switch(args[0]){
            case 'ping':
                message.reply("pong!")
                break;
            case 'vic':
                message.channel.send("GUUUUUUUIIIILTYYYYYY!");
                break;
            default:
                break;
        }
    }
});

//Logs the Bot into Discord using the Bot's authorization token/login
bot.login(BOT_SECRET_LOGIN);

//Use 'npm start' in the terminal to start the application (The Bot will appear online and send a message to the console)
//Use 'ctrl + c' to stop running the program! Or else you'll run multiple instances of the script!

// TODO: Add feature that allows scheduling/entering events, and commands to retrieve event information such as guests, data, location