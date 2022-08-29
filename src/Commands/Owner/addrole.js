const { SlashCommandBuilder, CommandInteraction, Client,
    PermissionFlagsBits, Message, GuildChannel, } = require("discord.js");
const EditReply = require('../../Systems/EditReply');
const rrModel = require('../../Schemas/ReactRoles')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-role")
        .setDescription("add-role")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption((options) =>
            options.setName("role").setDescription("role")
                .setRequired(true))
        .addStringOption((options) =>
            options.setName("description").setDescription("description")
                .setRequired(false))
        .addStringOption((options) =>
            options.setName("emoji").setDescription("emoji")
                .setRequired(false)),

    /**
         * @param {Client} client
         * @param {CommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, guild, guildId } = interaction


        const role = options.getRole('role')
        const roleDescription = options.getString('description') || null
        const roleEmoji = options.getString('emoji') || null

        if (guild.members.me.roles.highest.position <= role.position)
            return interaction.followUp(
                'role higher me'
            )

        const guildData = await rrModel.findOne({ guildId: guildId })

        const newRole = {
            roleId: role.id,
            roleDescription,
            roleEmoji
        }

        if (guildData) {
            const roleData = guildData.roles.find((x) => x.roleId === role.id)

            if (roleData) {
                roleData = newRole;
            } else {
                guildData.roles = [...guildData.roles, newRole]
            }

            await guildData.save()
        } else {
            await rrModel.create({
                guildId: guildId,
                roles: newRole
            })
        }
        interaction.followUp(
            `create new role ${role.name}`
        )
    }
}