const fetch = require('node-fetch');
const Discord = require('discord.js');
const database = require('../database/database.js');
const findFirstChannel = require('../utilities/findFirstChannel');

const phrases = ['went on to lose some mmr brace his soul!', 'about to share some mmr with enemy team!', 'about to feel deep sadness and mental pain!', 'into some mental suffering!', 'likes to be humiliated!', 'has a masochism kink!']
var randomNumber = Math.floor(Math.random() * phrases.length);

const activityStatus = async (oldPresence, newPresence) => {
    // let databaseData = await database.getUser({ id: newPresence.userID })
    let guildID = newPresence.guild.id
    //find the user by id in the guild
    const activityUser = newPresence.guild.members.cache.find(member => member.user.id == newPresence.userID).user.username

    //announce to general that user indeed started a dota 2 client


    const embededActivityMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Oh no it's seems like ${activityUser} ${phrases[randomNumber]}`)
        .setThumbnail('https://media.makeameme.org/created/disappointed-cat-is-5b7230.jpg')
    findFirstChannel(newPresence).send(embededActivityMessage);


}
const postGame = async (oldPresence, newPresence) => {
    let databaseData = await database.getUser({ id: oldPresence.userID })
    const activityUser = oldPresence.guild.members.cache.find(member => member.user.id == oldPresence.userID).user.username
    console.log(databaseData)
    let [data] = await Promise.all([
        fetch(`https://api.opendota.com/api/players/${databaseData[0]}/recentMatches`).then(response => response.json()),
    ])
    const indexOfLastSavedMatch = data.findIndex((match) => {
        return match.match_id === Number(databaseData[1])
    });





    // let newMatches = data.filter((element, index) => {
    //     if (index < 2) {
    //         return element
    //     }
    // });
    if (indexOfLastSavedMatch !== 0) {
        let ratio;
        await fetch(`https://api.opendota.com/api/players/${databaseData[0]}/wl?limit=${indexOfLastSavedMatch - 1}`).then(response => response.json()).then((data) => {
            ratio = data
        })
        if (ratio.win) {
            const embededActivityMessage = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${activityUser} Post game report`)
                .setDescription(`${activityUser} has ${ratio.win} wins and ${ratio.lose} after recent in-game activity!`)
                .setThumbnail('https://lh3.googleusercontent.com/proxy/DYvsWHh9fNEX-8Z_b5fojw9iCEALhD3uas8BcOjjNcZBLigQ3ZD1bvF1nTIscKHzuw2jNdcct2I14wkPbt-AFGCO-1NFAu31LnegTRwKuMoorp2on4P5OvtufZMN6Wy54kZBO0EP-HINQVmVI2w8xhU')

            // findFirstChannel(oldPresence).send(`Post game report: ${activityUser} has ${ratio.win} wins and ${ratio.lose} after recent in-game activity!`);
            findFirstChannel(oldPresence).send(embededActivityMessage);

        }
    }

}

module.exports = { activityStatus, postGame }