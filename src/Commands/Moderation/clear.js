const { SlashCommandBuilder, EmbedBuilder,
    PermissionsBitField, ChatInputCommandInteraction, Client, } = require('discord.js')
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear')
        .addIntegerOption((options) =>
            options
                .setName('amount')
                .setDescription('amount msg')
                .setRequired(true)
        )
        .addUserOption((options) =>
            options
                .setName('target')
                .setDescription('target')
                .setRequired(false)
        ),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const { channel, options } = interaction;

        const Amount = options.getInteger('amount');
        const Target = options.getUser('target');

        const Messages = await channel.messages.fetch();



        if (Target) {
            let i = 0;
            const filtered = [];
            (Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                EditReply(interaction, '✅', `Cleard ${messages.size} from ${Target}`);
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                EditReply(interaction, '✅', `Cleard ${messages.size} from this channel`);
            })
        }
    }
}