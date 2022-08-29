const { Client, ChatInputCommandInteraction, EmbedBuilder,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ComponentType, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')
const ms = require('ms')
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("kick")
        // .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers, PermissionFlagsBits.Administrator)
        .addUserOption((options) =>
            options.setName("user").setDescription("user").setRequired(true))
        .addStringOption((options) =>
            options.setName("reason").setDescription("reason").setRequired(false)),
    /**
         * @param {Client} client
         * @param {ChatInputCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction
        const member = options.getMember('user')
        const reason = options.getString('reason') || 'no reason'

        if (member.id === user.id) return EditReply(interaction, '🚫', 'You cant kick yourself')
        if (guild.ownerId === member.id) return EditReply(interaction, '🚫', 'You cant kick owner')
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, '🚫', 'You cant kick member higher')
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, '🚫', 'I cant kick member higher')

        const Embed = new EmbedBuilder().setColor(client.color)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId('kick-yes')
                .setLabel('Yes'),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId('kick-no')
                .setLabel('No')
        )
        const Page = await interaction.editReply({
            embeds: [
                Embed.setDescription(`kick?`)
            ], components: [row]
        })
        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button, time: ms('15s')
        })

        col.on('collect', i => {
            if (i.user.id !== user.id) return
            switch (i.customId) {
                case "kick-yes": {
                    member.kick({ reason })
                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | ${member} has kicked: ${reason}`)
                        ], components: []
                    })

                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`You kick ${guild.name}`)
                        ]
                    }).catch(err => {
                        if (err.code !== 50007) return console.log(err)
                    })
                } break;
                case "kick-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | kick cancelled`)
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