const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits, Message, GuildChannel, } = require("discord.js");
const EditReply = require('../../Systems/EditReply');
const rrModel = require('../../Schemas/ReactRoles')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-role")
        .setDescription("remove-role")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption((options) =>
            options.setName("role").setDescription("role")
                .setRequired(true))
    ,

    /**
         * @param {Client} client
         * @param {CommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options } = interaction

        const role = options.getRole('role')

        const guildData = await rrModel.findOne({
            guildId: interaction.guildId
        })

        if (!guildData)
            return interaction.followUp(
                'no roles'
            )

        const guildRoles = guildData.roles;

        const findRole = guildRoles.find((x) => x.roleId === role.id)
        if (!findRole)
            return interaction.followUp(
                `role not add`
            )

        const filteredRoles = guildRoles.filter((x) => x.roleId !== role.id)
        guildData.roles = filteredRoles

        await guildData.save()

        interaction.followUp(
            `removed: ${role.name}`
        )
    }
}