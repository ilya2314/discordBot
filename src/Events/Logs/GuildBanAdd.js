const { Client, Guild, User, EmbedBuilder } = require('discord.js')
const DB = require('../../Schemas/LogsChannel')
const SwitchDB = require('../../Schemas/GeneralLogs')

module.exports = {
    name: 'guildBanAdd',
    /**
    * @param {Guild} guild
    * @param {Client} client
    * @param {User} user
    */
    async execute(guild, user, client) {
        const { username, id, discriminator } = user

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })

        if (!Data) return
        if (Data.MemberBan === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('user ban')
                    .setDescription(`${username}#${discriminator} ${id} ban `)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: 'lox' })
                    .setTimestamp()
            ]
        })
    }
}