const { Client, Role, EmbedBuilder } = require('discord.js')
const DB = require('../../Schemas/LogsChannel')
const SwitchDB = require('../../Schemas/GeneralLogs')

module.exports = {
    name: 'roleCreate',
    /**
    * @param {Client} client
    * @param {Role} role
    */
    async execute(role, client) {
        const { guild, name } = role

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })

        if (!Data) return
        if (Data.RoleStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('role cret')
                    .setDescription(`role add ${role}, ${name}`)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: 'lox' })
                    .setTimestamp()
            ]
        })
    }
}