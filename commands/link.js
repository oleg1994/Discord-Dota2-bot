const fetch = require('node-fetch');
const Discord = require('discord.js')
const database = require('../database/database.js');



exports.run = async (client, message, args) => {
    const linkStatus = await database.linkStatus(message.author, args)
    console.log(linkStatus)
    if(linkStatus[0] && linkStatus){
        switch (linkStatus[0]) {
            case 'linked':
                message.channel.send(`Hey "${message.author.username}" this dota 2 profile now linked to this discord account, type "-profile" to see it.`);
                break;
            case 'exist':
                message.channel.send(`Hey "${message.author.username}" you already linked with dota 2 profile, type "-remove" to remove it before linking again.`);
                break;
            case 'added':
                message.channel.send(`Hey "${message.author.username}" this dota 2 profile now linked to this discord account, type "-profile" to see it.`);
                break;
            default:
                break;
        }
    }else{
        message.channel.send(`there was an error at link.js linkstatus[0]`);
    }
    
};

exports.help = {
    name: 'link',
    args: true,
    description: 'link discord to steam profile',
}