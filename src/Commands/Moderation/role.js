const { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("role")
        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption((options) =>
            options.setName("options").setDescription("options")
                .addChoices(
                    { name: 'Give', value: 'give' },
                    { name: 'Remove', value: 'remove' },
                    { name: 'Give All', value: 'give-all' },
                    { name: 'Remove All', value: 'remove-all' },
                )
                .setRequired(true))
        .addRoleOption((options) =>
            options.setName("role").setDescription("role").setRequired(true))
        .addUserOption((options) =>
            options.setName("user").setDescription("user").setRequired(false)),
    /**
         * @param {Client} client
         * @param {ChatInputCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, guild, member } = interaction

        const Options = options.getString('options')
        const Role = options.getRole('role')
        const Target = options.getMember('user') || member

        if (guild.members.me.roles.highest.position <= Role.position)
            return EditReply(interaction, '🚫', 'role manage for member higher me')

        switch (Options) {
            case "give": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position)
                    return EditReply(interaction, '🚫', 'role manage for me higher member')

                if (Target.roles.cache.find(r => r.id === Role.id))
                    return EditReply(interaction, '🚫', `${Target} already has role ${Role.name}`)

                await Target.roles.add(Role)

                EditReply(interaction, '🚫', `${Target} now has role ${Role.name}`)

            } break;
            case "remove": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position)
                    return EditReply(interaction, '🚫', 'role manage for member higher me')

                if (!Target.roles.cache.find(r => r.id === Role.id))
                    return EditReply(interaction, '🚫', `${Target} doesnt has role ${Role.name}`)

                await Target.roles.remove(Role)

                EditReply(interaction, '🚫', `${Target} has lost role ${Role.name}`)

            } break;
            case "give-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, '✅', `Everyone got ${Role.name}`)

                await Members.forEach(m => m.roles.add(Role))

            } break;
            case "remove-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, '✅', `Everyone lost ${Role.name}`)

                await Members.forEach(m => m.roles.remove(Role))

            } break;
        }
    }
}