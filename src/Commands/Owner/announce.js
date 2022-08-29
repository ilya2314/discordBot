const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce').setDescription('announce')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options.setName("title").setDescription("title").setRequired(true))
        .addStringOption((options) =>
            options.setName("message").setDescription("message").setRequired(true))
        .addStringOption((options) =>
            options.setName("color").setDescription("color").setRequired(false))
        .addStringOption((options) =>
            options.setName("footer").setDescription("footer").setRequired(false))
        .addBooleanOption((options) =>
            options.setName("timestamp").setDescription("timestamp").setRequired(false))
        .addStringOption((options) =>
            options.setName("ping").setDescription("ping").setRequired(false)
                .addChoices(
                    { name: "@everyone", value: "@everyone" },
                    { name: "@here", value: "@here" }
                )),

    /**
      *@param {Client} client
      * @param {CommandInteraction} interaction
      */
    async execute(interaction, client, args) {
        await interaction.deferReply({ ephemeral: false })
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.editReply({ content: 'Perms Denied' })

        const { options, user } = interaction;
        const title = options.getString("title");
        const message = options.getString("message");
        const color = options.getString("color");
        const footer = options.getString("footer");
        const timestamp = options.getBoolean("timestamp");
        const ping = options.getString("ping");
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
            .setTitle(`${title}`)
            .setDescription(`${message}`)

        if (color) embed.setColor(color);
        if (footer) embed.setFooter({ text: footer });
        if (timestamp) embed.setTimestamp();

        if (!ping) {
            interaction.followUp({
                embeds: [embed]
            });
        } else {
            interaction.followUp({
                content: `${ping === "@everyone" ? "@everyone" : "@here"}`,
                embeds: [embed],
                allowedMentions: {
                    parse: ['everyone']
                }
            });
        }
    }
}