const mongoose = require('mongoose');
const User = require('./schema/user')


// connection to mongodb
mongoose.connect('mongodb+srv://oleg:oleg123@cluster0-imopr.mongodb.net/DiscordDota2MMR?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected')
});

const linkStatus = async (discordUser, steamID) => {
    let status
    await User.find({ steamID: steamID }, function (err, docs) {
        if (err) { console.error(err) }
        // console.log(docs.length == 0, 'docs', docs)
        if (docs === undefined || docs.length == 0) {
            // console.log('check arr')
            registerUser(discordUser, steamID)
            //'new link'
            status = ['linked']
        } else {
            // console.log('else')
            let userExist = docs[0].discordID.includes(discordUser.id);
            console.log(userExist)
            if (userExist) {
                //'already linked'
                console.log('already exist in list')
                status = ['exist', docs[0].steamID]
            } else {
                console.log('add anothr')
                status = addUser(discordUser.id, steamID)
            }
        }
    });
    return status
}

const registerUser = (discordUser, steamID) => {
    let newUser = new User({
        discordID: discordUser.id,
        steamID: steamID[0],
    });
    newUser.save(function (err, user) {
        if (err) {
            return console.error(err)
        } else {
            console.log(user, 'success')
        }
    });

}
const getUser = async (discordUser) => {
    let status
    await User.find({ discordID: discordUser.id }, function (err, docs) {
        if (err) { console.error(err) }
        if (docs === undefined || docs.length == 0) {
            status = ['none']
        } else {
            console.log('getUSer')
            status = docs[0].steamID
        }
    });
    return status
}
const addUser = async (discordID, steamID) => {
    // console.log(discordID, steamID)
    let status;
    await User.findOneAndUpdate({ steamID: steamID }, { $addToSet: { discordID: discordID } }, function (err, result) {
        if (err) { console.log(err) } else {
            status = ['added']
        }
    })
    return status
}
const removeUser = async (discordUser) => {
    let status
    await User.findOneAndUpdate({ discordID: discordUser.id }, { $pullAll: { discordID: [discordUser.id] } }, function (err, result) {
        if (err) { console.log(err) }
        if (result) {
            //user found and removed
            status = 'removed'
        } else {
            //there isn't such user 
            status = 'none'
        }
    });
    return status
}

module.exports = { registerUser, linkStatus, removeUser, getUser }