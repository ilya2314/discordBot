const { Client, ChatInputCommandInteraction, PermissionFlagsBits,
    SlashCommandBuilder, Message, TextChannel, ChannelType } = require('discord.js')
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sen")
        .setDescription("sen")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((options) =>
            options.setName("channel").setDescription("channel").setRequired(true))
        .addStringOption((options) =>
            options.setName("text").setDescription("text")
                .setRequired(true)),
    /**
     * @param {String[]} args
     * @param {Message} message
         * @param {Client} client
         * @param {ChatInputCommandInteraction} interaction
         */
    async execute(interaction, args) {
        await interaction.deferReply({ ephemeral: true })
        const { message } = interaction

        const channel = (message ? message.mentions.first()
            : interaction.options.getChannel('channel'))

        if (!channel || channel.type !== ChannelType.GuildText) {
            return 'tag txt ch'
        }

        args.shift()
        const text =
            args.join(' ')

        channel.send(text)

        if (interaction) {
            interaction.reply({
                content: 'send msg', ephemeral: true
            })
        }
    }
}