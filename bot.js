const Discord = require('discord.js');
const client = new Discord.Client();
const secretToken = process.env.DISCORD_BOT_SECRET; //This must be kept secret and is stored using an ignored ".env" file

//Prefix that precedes a command
const PREFIX = "!";

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log("I AM HERE!");
    console.log(`${client.user.username} reporting for duty!`);
});

//An event listener for messages
client.on('message', msg => {
   
    let args = message.content.substring(PREFIX.length).split(" ");

    //If the message didn't come from the bot...
    if (msg.author.id != client.user.id) {
        //Switch instructions based on given command
        switch(args[0]){
            case 'ping':
                msg.reply("pong!")
                break;
            case 'vic':
                msg.channel.send("GUUUUUUUIIIILTYYYYYY!");
                break;
            default:
                break;
        }
    }
});

//Logs the Bot into Discord using the Bot's authorization token/login
client.login(secretToken);

//Use 'npm start' in the terminal sto start the application (The Bot will appear online and send a message to the console)
//Use 'ctrl + c' to stop running the program! Or else you'll run multiple instances of the script!

// TODO: Add feature that allows scheduling/entering events, and commands to retrieve event information such as guests, data, location