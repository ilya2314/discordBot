const { Interaction, Collection, SelectMenuBuilder, ActionRow, ActionRowBuilder } = require("discord.js");
const client = require('../index');

/**
 *
 * @param {Interaction} interaction
 * @param {String} cmd
 */
function cooldown(interaction, cmd) {
    if (!interaction || !cmd) return;
    let { client, member } = interaction;
    if (!client.cooldowns.has(cmd.name)) {
        client.cooldowns.set(cmd.name, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(cmd.name);
    const cooldownAmount = cmd.cooldown * 1000;
    if (timestamps.has(member.id)) {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            //return true
            return timeLeft;
        } else {
            timestamps.set(member.id, now);
            setTimeout(() => timestamps.delete(member.id), cooldownAmount);
            return false;
        }
    } else {
        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
        return false;
    }
}

function create_mh(array) {
    if (!array) throw new Error(`Opt not provided`)
    if (array.length < 0) throw new Error(`array has atleast to select`)
    let select_menu

    let id = `help-menus`
    let menus = []

    const emojiA = 'A'
    const emojiB = 'B'
    const emojiC = 'C'
    const emojiD = 'D'
    const emojiE = 'E'
    const emojiF = 'F'
    const emojiG = 'G'
    const emojiH = 'H'
    const emojiI = 'I'
    const emojiJ = 'J'
    const emojiK = 'K'
    const emojiL = 'L'

    const emo = {
        Community: `${emojiA}`,
        Information: `${emojiC}`,
        Moderation: `${emojiB}`,
        Utility: `${emojiE}`,
        Owner: `${emojiK}`
    }

    array.forEach(cca => {
        let name = cca
        let sName = `${name.toUpperCase()}`
        let tName = name.toLowerCase()
        let fName = name.toUpperCase()

        return menus.push({
            label: sName,
            description: `${tName} comm`,
            value: fName
        })
    })

    const chicken = new SelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(`Choose categ`)
        .addOptions(menus)

    select_menu = new ActionRowBuilder()
        .addComponents(
            chicken
        )

    return {
        smenu: [select_menu],
        sid: id
    }
}

module.exports = {
    cooldown, create_mh
};
