const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { activityStatus, postGame } = require('./liveUpdates/activity');
const client = new Discord.Client();
const fs = require('fs')


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
app.get('/', (req, res) => res.send('Dota2 bot for discord!'));



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
    setInterval(() => {
        client.user.setActivity(`${client.guilds.cache.size} Servers`)
        client.user.setAvatar(`https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${Math.floor(Math.random() * 8) + 0}.png`)
        console.log('updated avatar and activity')
    }, 3600000); // Runs this every 1 hour.
});


client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence.activities[0]) {
        // console.log(newPresence.activities[0],'new')
        if (newPresence.activities[0].name == 'Dota 2') {
            activityStatus(oldPresence, newPresence)
        }
    }

    if (oldPresence.activities[0]) {
        if (oldPresence.activities[0].name == 'Dota 2') {
            postGame(oldPresence, newPresence)
        }
    }
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









client.login(process.env.TOKEN);









