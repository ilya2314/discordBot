const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { author, guild, content } = message
        const { user } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription(`message`)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "intro" })
                    .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://ru.ru')
                        .setLabel('Inv'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://ru.ru')
                        .setLabel('Dash'),
                )
            ]
        }).then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => {
                    if (err.code !== 10008) return console.log(err)
                })
            }, ms('10s'));
        })
    }
}