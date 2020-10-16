const fetch = require('node-fetch');
const Canvas = require('canvas')
const Discord = require('discord.js')
const detectRank = require('../utilities/badgeCreator.js');
const database = require('../database/database.js');
Canvas.registerFont('./SansSerif.otf', { family: 'SansX' })


const measureText = (canvas, text, size) => {
    const ctx = canvas.getContext('2d');
    // Declare a base size of the font
    let fontSize = size;
    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `700 ${fontSize -= 4}px SansX`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);
    // Return the result to use in the actual canvas
    return ctx.font;
};

exports.run = async (client, message, args) => {
    const getUser = await database.getUser(message.author)

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./img/BG2.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (getUser[0] !== 'none' && getUser[0]) {
        let [data, mmr, wl, profile] = await Promise.all([
            fetch(`https://api.opendota.com/api/players/${getUser}`).then(response => response.json()),
            fetch(`https://api.opendota.com/api/players/${getUser}`).then(response => response.json()),
            fetch(`https://api.opendota.com/api/players/${getUser}/wl`).then(response => response.json()),
        ])
        if (data.rank_tier) {
            const badge = await Canvas.loadImage(`./img/badges/${detectRank(data.rank_tier)[0]}`);
            const star = await Canvas.loadImage(`./img/stars/${detectRank(data.rank_tier)[1]}`);
            const avatar = await Canvas.loadImage(data.profile.avatarfull);

            ctx.beginPath();
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.font = measureText(canvas, `${data.profile.personaname}`, 40);
            // Select the style that will be used to fill the text in
            ctx.fillStyle = 'white';
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 4;
            // Actually fill the text with a solid color
            ctx.fillText(`IGN: ${data.profile.personaname}`, canvas.width / 3, 50);

            // ctx.fillText(`HISTORY: ${victories.join(', ').replace(/,/g, '-').replace(/\s/g,'')}`, canvas.width / 3, canvas.height / 2);
            ctx.fillText(`MMR: ~${mmr.mmr_estimate.estimate}`, canvas.width / 3, 90);
            ctx.fillText(`W:${wl.win} L:${wl.lose} ${`${wl.win / (wl.win + wl.lose) * 100}`.toString().slice(0, 4) + `%`} `, canvas.width / 3, 130);

            ctx.drawImage(avatar, 25, 25, 200, 200);
            ctx.drawImage(badge, 130, 147, 110, 110);
            ctx.drawImage(star, 130, 145, 110, 110);

            //immortalRanks
            if (data.leaderboard_rank) {
                ctx.font = `700 21px sans-serif`
                ctx.fillText(`${data.leaderboard_rank}`, 160, 247, 100, 100);
            }


            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
            message.channel.send(attachment);

            // ctx.beginPath();
            // ctx.strokeStyle = '#74037b';
            // ctx.strokeRect(0, 0, canvas.width, canvas.height);
            // // Select the style that will be used to fill the text in
            // ctx.fillStyle = 'white';
            // ctx.shadowOffsetX = 4;
            // ctx.shadowOffsetY = 4;
            // ctx.shadowColor = "rgba(0,0,0,0.3)";
            // ctx.shadowBlur = 4;
            // // Actually fill the text with a solid color
            // ctx.fillText(`IGN: ${profile.players[0].name}`, canvas.width / 3, 50);

            // // ctx.fillText(`HISTORY: ${victories.join(', ').replace(/,/g, '-').replace(/\s/g,'')}`, canvas.width / 3, canvas.height / 2);
            // ctx.fillText(`MMR: hidden`, canvas.width / 3, 90);
            // ctx.fillText(`W:hidden L:hidden`, canvas.width / 3, 130);

            // ctx.drawImage(avatar, 25, 25, 200, 200);

            // const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
            // message.channel.send(attachment);
        } else {
            // expose data disabled
            message.channel.send(`Hey "${message.author.username}" your Dota 2 profile seems to be private we only get your match data if you have the "Expose Public Match Data" setting enabled in the Dota 2 game client. If this setting is currently disabled we won't able to access your profile data. if you would like to enable the "Expose Public Match Data" but don't know how to you can follow this tutorial https://www.youtube.com/watch?v=TD72bEfNovM `);
        }
    } else {
        // not linked profile
        message.channel.send(`Hey "${message.author.username}" to use this command you need to link your dota 2 profile first, to do so type "-link STEAMID "`);
    }
}

exports.help = {
    name: 'profile',
    args: false,
    description: 'Shows the dota 2 profile data based on linked dota 2 profile',
}