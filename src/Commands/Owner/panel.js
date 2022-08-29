const rrModel = require('../../Schemas/ReactRoles')
const { Client, CommandInteraction, SlashCommandBuilder, EmbedBuilder,
    ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel').setDescription('panel'),
    /**
         * @param {Client} client
         * @param {CommandInteraction} interaction
         */

    async execute(interaction, client) {
        //await interaction.deferReply({ ephemeral: false })
        const { guildId, guild } = interaction
        const guildData = await rrModel.findOne({
            guildId: guildId
        })
        if (!guildData?.roles)
            return interaction.reply({ content: 'no roles' })

        const options = guildData.roles.map(x => {
            const role = guild.roles.cache.get(x.roleId)

            return {
                label: role.name,
                value: role.id,
                description: x.roleDescription || 'no desc',
                emoji: x.roleEmoji
            }
        })

        const panelEmbed = new EmbedBuilder()
            .setTitle('select role').setColor('Aqua')


        const components = [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId('reaction-roles')
                    .setMinValues(0)
                    .setMaxValues(options.length)
                    .setPlaceholder('sel role')
                    .addOptions(options)
            )
        ]
        interaction.reply({ embeds: [panelEmbed], components })
    }
}