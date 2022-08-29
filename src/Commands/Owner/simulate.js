const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js");
const EditReply = require('../../Systems/EditReply');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("simulate")
        .setDescription("simulate")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options.setName("options").setDescription("options")
                .setChoices(
                    {
                        name: 'Join',
                        value: 'join'
                    },
                    {
                        name: 'Leave',
                        value: 'leave'
                    }
                ).setRequired(true)),

    /**
         * @param {Client} client
         * @param {ChatInputCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, member } = interaction
        const Options = options.getString('options')

        if (user.id !== '254646128753115136') return EditReply(interaction, '🚫', 'comm is classified')

        switch (Options) {
            case "join":
                EditReply(interaction, `✅`, `Join ev`)

                client.emit('guildMemberAdd', member)
                break;

            case "leave":
                EditReply(interaction, `✅`, `Leave ev`)

                client.emit('guildMemberRemove', member)
                break;
        }
    }
}