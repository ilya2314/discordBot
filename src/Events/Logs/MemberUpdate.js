const { Client, GuildMember, EmbedBuilder } = require('discord.js')
const DB = require('../../Schemas/LogsChannel')
const SwitchDB = require('../../Schemas/GeneralLogs')

module.exports = {
    name: 'guildMemberUpdate',
    /**
    * @param {GuildMember} oldMember
    * @param {Client} client
    * @param {GuildMember} newMember
    */
    async execute(oldMember, newMember, client) {
        const { guild, user } = newMember

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { console.log(err) })

        if (!Data) return
        if (Data.MemberRole === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        const oldRoles = oldMember.roles.cache.map(r => r.id)
        const newRoles = oldMember.roles.cache.map(r => r.id)



        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: 'lox' })
            .setTimestamp()

        if (oldRoles.length > newRoles.length) {
            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle('mem upd')
                        .setDescription(`${user.tag} lost ${Role.name}`)
                ]
            })
        } else if (oldRoles.length < newRoles.length) {
            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle('mem upd')
                        .setDescription(`${user.tag} got ${Role.name}`)
                ]
            })
        } else if (newMember.nickname !== oldMember.nickname) {


            return Channel.send({
                embeds: [
                    Embed
                        .setTitle('mem upd')
                        .setDescription(`${newMember.user.tag} chng ${oldMember.nickname} => ${newMember.nickname}`)
                ]
            })
        } else if (!oldMember.premiumSince && newMember.premiumSince) {


            return Channel.send({
                embeds: [
                    Embed
                        .setTitle('bst detec')
                        .setDescription(`${newMember.user.tag} boost`)
                ]
            })
        } else if (!newMember.premiumSince && oldMember.premiumSince) {


            return Channel.send({
                embeds: [
                    Embed
                        .setTitle('unbst detec')
                        .setDescription(`${newMember.user.tag} unbst`)
                ]
            })
        }

    }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 */
function Unique(arr1, arr2) {
    let un1 = arr1.filter(o => arr2.indexOf(o) === -1)
    let un2 = arr2.filter(o => arr1.indexOf(o) === -1)

    const unique = un1.concat(un2)

    return unique
}