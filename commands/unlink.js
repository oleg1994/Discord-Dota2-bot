const fetch = require('node-fetch');
const Discord = require('discord.js')
const database = require('../database/database.js');



exports.run = async (client, message, args) => {
    let removeStatus = null
    try {
        removeStatus = await database.removeUser(message.author)
        if (!removeStatus) removeStatus = null;
    } catch (error) {
        console.log(error)
    }

    if (removeStatus !== null && removeStatus[0] === 'removed') {
        message.channel.send(`Hey "${message.author.username}" you successfully unlinked your discord from Dota 2 profile`);
    } else {
        message.channel.send(`Hey "${message.author.username}" to use this command you need to link your Dota 2 profile first, to do so type "-link STEAMID "`);
    }


};

exports.help = {
    name: 'unlink',
    args: false,
    description: 'unlink discord of linked steam profile',
}