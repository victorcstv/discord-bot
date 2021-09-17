require('dotenv/config');
const { Client } = require('discord.js');

const bot = new Client({ intents: process.env.INTENTS });

const PREFIX = '?';

bot.on('ready', bot => {
  console.log('Bot is online!');
});

bot.on('message', async msg => {
  let args = msg.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
      case 'ping':
          msg.channel.send('Pong');
          break;
      
      case 'clear':
        if(!args[1]) return msg.reply('Informe quantas mensagens deseja apagar...');
        msg.channel.bulkDelete(args[1]);
      break;

  }
})

bot.login(process.env.BOT_TOKEN);