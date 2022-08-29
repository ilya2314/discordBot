const { ContextMenuCommandBuilder, EmbedBuilder, Client, ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");
const translate = require('@iamtraction/google-translate')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("translate")
        .setType(ApplicationCommandType.Message),
    /**
         * @param {Client} client
         * @param {ContextMenuCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { channel, targetId } = interaction

        const query = await channel.messages.fetch({ message: targetId })
        const raw = query.content

        const translated = await translate(query, { to: 'en' })

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('Translation')
                    .addFields([
                        { name: 'Raw', value: '```' + raw + '```' },
                        { name: 'Translated', value: '```' + translated.text + '```' },
                    ])
                    .setFooter({ text: 'translated' })
                    .setTimestamp()
            ]
        })
    }
}