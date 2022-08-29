const { SlashCommandBuilder, ButtonStyle, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const DB = require('../../Schemas/verification');
const EditReply = require('../../Systems/EditReply');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("verify")
        //.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption((options) =>
            options.setName("role").setDescription("role").setRequired(true))
        .addChannelOption((options) =>
            options.setName("channel").setDescription("channel").setRequired(false)),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const { options, guild, channel } = interaction
        const role = options.getRole('role')
        const Channel = options.getChannel('channel') || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) {
            Data = new DB({
                Guild: guild.id,
                Role: role.id
            })
            await Data.save()
        } else {
            Data.Role = role.id
            await Data.save()
        }

        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('✅ | Verif')
                    .setDescription('click Verif')
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify')
                        .setLabel('verify')
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })
        return EditReply(interaction, '✅', `suc Verif ${Channel}`)
    }
}