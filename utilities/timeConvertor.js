const timeConverter = (epochTime, matchDuration) => {
    var utcSeconds = epochTime;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
    d.setMinutes(d.getMinutes() + Number(matchDuration.toString().slice(0, 2)));
    function getTimeSince(start) {
        var msSince = (new Date() - start);
        var msInDay = 24 * 60 * 60 * 1000
            , msInHour = 60 * 60 * 1000
            , msInMinute = 60 * 1000
            , msInSecond = 1000;

        if (msSince > msInDay) { // greater than one day
            return parseInt(msSince / msInDay).toString() + 'days ago';
        } else if (msSince > msInHour) { // greater than one hour
            return parseInt(msSince / msInHour).toString() + 'hours ago';
        } else if (msSince > msInMinute) { // greater than one minute
            return parseInt(msSince / msInMinute).toString() + 'minutes ago';
        } else { // seconds ago
            var sSince = parseInt(msSince / msInSecond);
            if (sSince > 0) {
                return sSince.toString() + 's ago';
            } else {
                return "Just Now";
            }
        }
    };
    return getTimeSince(d)
}

module.exports = timeConverter