const { Client, InteractionType, MessageComponentInteraction } = require("discord.js");
const DB = require('../../Schemas/verification')
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {MessageComponentInteraction} message
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, customId, member, type } = interaction

        if (type !== InteractionType.MessageComponent) return

        const CustomID = ['verify']
        if (!CustomID.includes(customId)) return
        await interaction.deferReply({ ephemeral: true })

        const Data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return EditReply(interaction, '🚫', 'couldnt find data')

        const Role = guild.roles.cache.get(Data.Role)
        if (member.roles.cache.has(Role.id)) return EditReply(interaction, '🚫', 'You already verified')

        await member.roles.add(Role)

        EditReply(interaction, '✅', 'You now verified')
    }
}