const fetch = require('node-fetch');
const Canvas = require('canvas')
const Discord = require('discord.js')
const detectRank = require('../utilities/badgeCreator.js');
const database = require('../database/database.js');



const measureText = (canvas, text, size) => {
    const ctx = canvas.getContext('2d');
    // Declare a base size of the font
    let fontSize = size;
    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `700 ${fontSize -= 4}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);
    // Return the result to use in the actual canvas
    return ctx.font;
};

exports.run = async (client, message, args) => {
    let [data, mmr, wl, profile] = await Promise.all([
        fetch(`https://api.opendota.com/api/players/${args}`).then(response => response.json()),
        fetch(`https://api.opendota.com/api/players/${args}`).then(response => response.json()),
        fetch(`https://api.opendota.com/api/players/${args}/wl`).then(response => response.json()),
        fetch(`https://api.stratz.com/api/v1/search/player?query=${args}`).then(response => response.json()),

    ])
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./img/BG2.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

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

    } else {
        ctx.beginPath();
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.font = '700 60px sans-serif';
        // Select the style that will be used to fill the text in
        ctx.fillStyle = 'white';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 4;
        // Actually fill the text with a solid color
        ctx.fillText(`PRIVATE PROFILE`, canvas.width / 8, canvas.height / 1.8);
        ctx.fillText(`¯\\_(ツ)_/¯`, canvas.width / 3.5, canvas.height / 1.2);


        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
        message.channel.send(attachment);
    }





};

exports.help = {
    name: 'check',
    args: true,
    description: 'check dota 2 profile without linking.',
}