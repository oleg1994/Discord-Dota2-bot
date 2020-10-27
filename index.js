const Discord = require('discord.js');
const { prefix } = require('./config.json');
const client = new Discord.Client();
const fs = require('fs');


let TOKEN, PREFIX;
try {
  const config = require("./config.json");
  TOKEN = config.TOKEN;
  PREFIX = config.PREFIX;
} catch (error) {
  TOKEN = process.env.TOKEN;
  PREFIX = process.env.PREFIX;
}



const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
app.get('/', (req, res) => res.send('Dota2-mmr-tracker bot for discord!'));



require('dotenv').config()
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Loaded command '${command.help.name}'`);
    client.commands.set(command.help.name, command);
}














client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    if (command.help.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }
    try {
        command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});







client.login(TOKEN);

// client.login(process.env.TOKEN); //









