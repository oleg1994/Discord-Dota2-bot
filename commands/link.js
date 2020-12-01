const fetch = require('node-fetch');
const Discord = require('discord.js')
const database = require('../database/database.js');



exports.run = async (client, message, args) => {
    let [user, matches] = await Promise.all([
        fetch(`https://api.opendota.com/api/players/${args}`).then(response => response.json()),
        fetch(`https://api.opendota.com/api/players/${args}/recentMatches`).then(response => response.json()),
    ])
    
    if (user.profile) {
        const linkStatus = await database.linkStatus(message.author, args, matches[0].match_id)
        if (linkStatus[0] && linkStatus) {
            switch (linkStatus[0]) {
                case 'linked':
                    message.channel.send(`Hey "${message.author.username}" this dota 2 profile now linked to this discord account, type "-profile" to see it.`);
                    break;
                case 'exist':
                    message.channel.send(`Hey "${message.author.username}" you already linked with dota 2 profile, type "-unlink" to remove it before linking again.`);
                    break;
                case 'added':
                    message.channel.send(`Hey "${message.author.username}" this dota 2 profile now linked to this discord account, type "-profile" to see it.`);
                    break;
                default:
                    break;
            }
        }
    } else {
        message.channel.send(`No result for provided steam id.`);
    }
}
exports.help = {
    name: 'link',
    args: true,
    description: 'link discord to steam profile',
}