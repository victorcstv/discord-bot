require('dotenv/config');

const { Client, RichEmbed } = require('discord.js');
const ytdl = require('ytdl-core');

const bot = new Client({ intents: process.env.INTENTS });

const PREFIX = '?';
var servers = {};

bot.on('ready', bot => {
  console.log('Bot is online!');
});

bot.on('message', async msg => {
  let args = msg.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
      case 'ping':
        msg.channel.send('Pinging...').then(async (message) => {
          message.delete();
          msg.channel.send(`Ping: ${message.createdTimestamp - msg.createdTimestamp}ms...`);
        })
        break;

      case 'clear':
        if(!args[1]) return msg.reply('Informe quantas mensagens deseja apagar...');
        msg.channel.bulkDelete(parseInt(args[1]) + 1);
      break;

      case 'avatar':
        msg.reply(msg.author.avatarURL);
      break;
        
      case 'play':
        function play(connection, msg){
          var server = servers[msg.guild.id];

          server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
          server.queue.shift();
          
          server.dispatcher.on("end", function(){
            if(server.queue[0]){
              play(connection, msg);
            } else {
              connection.disconnect();
            }
          });
        }

        if(!args[1]){
          msg.channel.send('Você precisa colocar um link!');
          return;
        }

        if(!msg.member.voiceChannel){
          msg.channel.send('Você precisa estar em um canal de voz para usar esse comando!');
          return;
        }

        if(!servers[msg.guild.id]) servers[msg.guild.id] = {
          queue: []
        }

        var server = servers[msg.guild.id];
        server.queue.push(args[1]);

        if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function (connection){
          play(connection, msg);
        })

      break;
      
      case 'skip':
        var server = servers[msg.guild.id];

        if(server.dispatcher) server.dispatcher.end();
        msg.channel.send('Passando para a próxima música...');
      break;

      case 'stop':
        var server = servers[msg.guild.id];

        if(msg.guild.voiceConnection){
          for(var i = server.queue.length -1; i >= 0; i--){
            server.queue.splice(i, 1);
          }

          server.dispatcher.end();
          msg.channel.send('Saindo do canal de voz...');
          console.log('queue stopped');
        }

        if(msg.guild.connection) msg.guild.voiceConnection.disconnect();
      break;
        
  }
});

bot.login(process.env.BOT_TOKEN);