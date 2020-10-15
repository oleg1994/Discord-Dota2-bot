const discord = require('discord.js')
const client = new discord.Client();
const fetch = require('node-fetch');
const Canvas = require('canvas')

const CanvasCreator = async (params) => {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage('./img/BG.png')
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    // Use helpful Attachment class structure to process the file for you
    const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    return attachment
}
module.exports = CanvasCreator();