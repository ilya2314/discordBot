const { Client, TextChannel, EmbedBuilder } = require('discord.js')
const DB = require('../../Schemas/LogsChannel')
const SwitchDB = require('../../Schemas/GeneralLogs')

module.exports = {
    name: 'channelUpdate',
    /**
    * @param {TextChannel} oldChannel
    * @param {TextChannel} newChannel
    */
    async execute(oldChannel, newChannel, client) {
        const { guild, name } = newChannel

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        if (oldChannel.topic !== newChannel.topic) {
            return Channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('topic upd')
                        .setDescription(`${newChannel} change ${oldChannel.topic} => ${newChannel.topic}`)
                        .setThumbnail(guild.iconURL())
                        .setFooter({ text: 'lox' })
                        .setTimestamp()

                ]
            })
        }
    }
}