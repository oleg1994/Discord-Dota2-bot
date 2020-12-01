const findFirstChannel = (newPresence) => {
    let channelID;
    let channels = newPresence.guild.channels.cache;

    for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "text") {
            channelID = c[0];
            break;
        }
    }

    let channel = newPresence.guild.channels.cache.get(newPresence.guild.systemChannelID || channelID);
    return channel;
}
module.exports = findFirstChannel