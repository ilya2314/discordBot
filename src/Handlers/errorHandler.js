const { EmbedBuilder } = require('discord.js')
const ChannelID = '882317474597584966'

function errorHandler(client) {
    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({ text: 'anti-crash' })
        .setTitle('Error enc')

    process.on('unhandledRejection', (reason, p) => {
        console.log(reason, p)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription('**unhandledRejection:\n\n**```' + reason + '```')
            ]
        })
    })

    process.on('uncaughtException', (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription('**uncaughtException:\n\n**```' + err + '\n\n' + origin.toString() + '```')
            ]
        })
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                    .setDescription('**uncaughtException (MONITOR):\n\n**```' + err + '\n\n' + origin.toString() + '```')
            ]
        })
    })
}

module.exports = { errorHandler }