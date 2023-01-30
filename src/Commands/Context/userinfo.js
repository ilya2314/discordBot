const { ContextMenuInteraction, EmbedBuilder, ContextMenuCommandBuilder, ContextMenuCommandInteraction, ApplicationCommandType, SlashCommandBuilder, Presence, ActivityType } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("userinfo")
        .setType(ApplicationCommandType.User),

    /**
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     */
    async execute(interaction, client) {
        //   const target = await interaction.guild.members.fetch(interaction.targetId);
        await interaction.deferReply({ ephemeral: true })
        const { guild, targetId } = interaction

        const target = await guild.members.cache.get(targetId)

        const Response = new EmbedBuilder()
            .setColor('Aqua')
            .setAuthor({ name: target.user.tag, iconURL: target.user.avatarURL({ dynamic: true, size: 512 }) })
            .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'ID', value: `${target.user.id}` },
                { name: "Roles", value: `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}` },
                { name: "Member Since", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: "Discord User Since", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true },
            )

        return interaction.editReply({ embeds: [Response] })
    }
}