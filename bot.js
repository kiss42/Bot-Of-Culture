const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log("I AM HERE!");
     console.log(`${client.user.username} reporting for duty!`);
});

//On message receipt
client.on('message', msg => {
    //If the message didn't come from the bot...
    if (msg.author.id != client.user.id) {
      if (msg.content === '!Ping'){
        msg.reply('Pong');
      }
    }
  })

//Logs the Bot into Discord using the Bot's authorization token/login
client.login(auth.token);

//Use 'npm start' in the terminal sto start the application (The Bot will appear online and send a message to the console)
//Use 'ctrl + c' to stop running the program! Or else you'll run multiple instances of the script!