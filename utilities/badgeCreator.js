const detectRank = (rank) => {
    let badge = rank.toString().substring(0, 1)
    let star = rank.toString().substring(1, 2);

    switch (badge) {
        case '1':
            badge = `rank_icon_1.png`
            break;
        case '2':
            badge = `rank_icon_2.png`
            break;
        case '3':
            badge = `rank_icon_3.png`
            break;
        case '4':
            badge = `rank_icon_4.png`
            break;
        case '5':
            badge = `rank_icon_5.png`
            break;
        case '6':
            badge = `rank_icon_6.png`
            break;
        case '7':
            badge = `rank_icon_7.png`
            break;
        case '8':
            badge = `rank_icon_8.png`
            break;
        default:
            break;
    }
    switch (star) {
        case '0':
            //no stars
            star = `emptyIMG.png`
            break;
        case '1':
            star = `star_1.png`
            break;
        case '2':
            star = `star_2.png`
            break;
        case '3':
            star = `star_3.png`
            break;
        case '4':
            star = `star_4.png`
            break;
        case '5':
            star = `star_5.png`
            break;
        case '6':
            star = `star_6.png`
            break;
        case '7':
            star = `star_7.png`
            break;
        case '8':
            star = `star_8.png`
            break;
        default:
            break;
    }


    return [badge, star]
}

module.exports = detectRank;