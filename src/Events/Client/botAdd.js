const { Client, Guild, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "guildCreate",

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {
        const { name, members, channels } = guild
        let channelToSend
        channels.cache.forEach(channel => {
            if (channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(members.me).has('SendMessages'))
                channelToSend = channel
        })
        if (!channelToSend) return

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: name, iconURL: guild.iconURL() })
            .setDescription('thx')
            .setFooter({ text: 'dev' })
            .setTimestamp()

        const Row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://ru.ru')
                .setLabel('Inv'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://ru.ru')
                .setLabel('Dash'),
        )
        channelToSend.send({ embeds: [Embed], components: [Row] })
    }
}