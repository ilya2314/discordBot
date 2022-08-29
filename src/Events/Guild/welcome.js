const { Client, GuildMember, EmbedBuilder } = require('discord.js')
const DB = require('../../Schemas/welcome')

module.exports = {
    name: 'guildMemberAdd',
    /**
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(member, client) {
        const { user, guild } = member

        const Data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return

        const Message = `${user} welcome ${guild.name}`

        let dmMsg

        if (Data.DMMessage !== null) {
            var dmMessage = Data.DMMessage.content

            if (dmMessage.length !== 0) dmMsg = dmMessage
            else dmMsg = Message
        } else dmMsg = Message

        if (Data.Channel !== null) {
            const Channel = guild.channels.cache.get(Data.Channel)
            if (!Channel) return

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`Welcome ${member}\n\n Acc creat: <t:${user.createdTimestamp}:R>\n
            Member count: \`${guild.memberCount}\``)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: 'welcome' })
                .setTimestamp()

            Channel.send({ content: `${Message}`, embeds: [Embed] })
        }

        if (Data.DM === true) {
            const Embed = Data.DMMessage.embed

            if (Data.Content !== true && Data.Embed === true) {
                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })
                if (!Sent) return
                if (Embed) Sent.edit({ embeds: [Embed] })
            } else if (Data.Content === true && Data.Embed !== true) {
                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })
            } else if (Data.Content !== true && Data.Embed === true) {
                if (Embed) member.send({ embeds: [Embed] }).catch(err => {
                    if (err.code !== 50007) return console.log(err)
                })
            } else return
        }
    }
}