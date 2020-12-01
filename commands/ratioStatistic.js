const fetch = require('node-fetch');
const database = require('../database/database.js');




exports.run = async (client, message, args) => {
    const getUser = await database.getUser(message.author)
    console.log(message.author)
    if (getUser !== 'none' && getUser !== undefined) {
        let ratio;
        await fetch(`https://api.opendota.com/api/players/${getUser[0]}/wl?limit=10`).then(response => response.json()).then((data) => {
            ratio = data
        })
        console.log(ratio)
        if(ratio.win && ratio.lose !== 0){
            //returns win lose ratio
            message.channel.send(`Hey "${message.author.username}" your dota 2 W/L ratio for last 10 games is ${ratio.win}W-${ratio.lose}L.`);
        }else{
            //returns the profile is private tutorial
            message.channel.send(`Hey "${message.author.username}" your Dota 2 profile seems to be private we only get your match data if you have the "Expose Public Match Data" setting enabled in the Dota 2 game client. If this setting is currently disabled we won't able to access your profile data. if you would like to enable the "Expose Public Match Data" but don't know how to you can follow this tutorial https://www.youtube.com/watch?v=TD72bEfNovM `);
        }
    }else{
        message.channel.send(`Hey "${message.author.username}" to use this command you need to link your dota 2 profile first, to do so type "-link STEAMID "`);
    }



};

exports.help = {
    name: 'ratio',
    args: false,
    description: 'Shows win/lose ratio for linked account',
}