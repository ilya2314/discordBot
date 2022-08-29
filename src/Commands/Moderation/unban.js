const { Client, ChatInputCommandInteraction, EmbedBuilder,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ComponentType, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')
const ms = require('ms')
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("unban")
        // .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers, PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options.setName("user-id").setDescription("user-id").setRequired(true)),
    /**
       * @param {Client} client
       * @param {ChatInputCommandInteraction} interaction
       */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, guild, user } = interaction
        const id = options.getString('user-id')
        if (isNaN(id)) return EditReply(interaction, '🚫', 'Provide id')

        const bannedMembers = await guild.bans.fetch()
        if (!bannedMembers.find(x => x.user.id === id)) return EditReply(interaction, '🚫', 'User not banned')

        const Embed = new EmbedBuilder().setColor(client.color)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId('unban-yes')
                .setLabel('Yes'),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId('unban-no')
                .setLabel('No')
        )
        const Page = await interaction.editReply({
            embeds: [
                Embed.setDescription(`unban?`)
            ], components: [row]
        })
        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button, time: ms('15s')
        })

        col.on('collect', i => {

            if (i.user.id !== user.id) return

            switch (i.customId) {
                case "unban-yes": {
                    guild.members.unban(id)
                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | user has unbaned`)
                        ], components: []
                    })
                } break;
                case "unban-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | unban cancelled`)
                        ], components: []
                    })
                } break;
            }
        })

        col.on('end', (collected) => {
            if (collected.size > 0) return
            interaction.editReply({
                embeds: [
                    Embed.setDescription(`✅ | You didnt provide time`)
                ], components: []
            })
        })
    }

}