const { ContextMenuCommandBuilder, EmbedBuilder, Client, ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");
const EditReply = require('../../Systems/EditReply');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("avatar")
        .setType(ApplicationCommandType.User),
    /**
         * @param {Client} client
         * @param {ContextMenuCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { guild, targetId } = interaction

        const target = await guild.members.cache.get(targetId)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${target.user.username} avatar`, iconURL: target.user.displayAvatarURL() })
            .setImage(target.user.displayAvatarURL({ size: 512 }))
            .setFooter({ text: 'avatar' })
            .setTimestamp()

        return interaction.editReply({ embeds: [Embed] })
    }
}