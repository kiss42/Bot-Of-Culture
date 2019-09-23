const Discord = require('discord.js');
const client = new Discord.Client();
const secretToken = process.env.DISCORD_BOT_SECRET; //This must be kept secret and is stored using an ignored ".env" file

client.on('ready', () => {
    console.log("I AM HERE!");
     console.log(`${client.user.username} reporting for duty!`);
});

//On message receipt
client.on('message', msg => {
    //All commands will start with an uppercase character
    //If the message didn't come from the bot...
    if (msg.author.id != client.user.id) {
      if (msg.content === '!Ping'){
        msg.reply('Pong');
      }
    }
  })

//Logs the Bot into Discord using the Bot's authorization token/login
client.login(secretToken);

//Use 'npm start' in the terminal sto start the application (The Bot will appear online and send a message to the console)
//Use 'ctrl + c' to stop running the program! Or else you'll run multiple instances of the script!

// TODO: Add feature that allows scheduling/entering events, and commands to retrieve event information such as guests, data, location