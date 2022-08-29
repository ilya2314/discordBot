const { Client, CommandInteraction, InteractionType, ApplicationCommandOptionType,
    EmbedBuilder, SelectMenuBuilder, GuildMember } = require("discord.js")
const { ApplicationCommand } = InteractionType
const client = require('../../index');
const Reply = require("../../Systems/Reply")
const BlacklistGuildDB = require('../../Schemas/BlacklistG')
const BlacklistUserDB = require('../../Schemas/BlacklistU')

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { user, guild, commandName, member, type, customId, values, } = interaction
        const command = client.commands.get(commandName)
        const args = [];

        if (interaction.isCommand()) {

            if (!guild || user.bot) return
            if (type !== ApplicationCommand) return


            for (let option of interaction.options.data) {
                if (option.type === ApplicationCommandOptionType.Subcommand) {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }

            const BlacklistGuildData = await BlacklistGuildDB.findOne({ Guild: guild.id }).catch(err => { })
            const BlacklistUserData = await BlacklistUserDB.findOne({ User: guild.id }).catch(err => { })

            const Embed = new EmbedBuilder()
                .setColor(client.color)
                .setThumbnail(guild.iconURL())
                .setTimestamp()
                .setFooter({ text: 'blacklist' })



            if (!command) return Reply(interaction, "⁉️", 'error', true) && client.
                commands.delete(commandName)

            if (BlacklistGuildData) return interaction.reply({
                embeds: [
                    Embed.setTitle('server blacklist')
                        .setDescription(`serv bl <t:${parseInt(BlacklistGuildData.Time / 1000)}:R>, reason ${BlacklistGuildData.Reason}`)
                ]
            })

            if (BlacklistUserData) return interaction.reply({
                embeds: [
                    Embed.setTitle('server blacklist')
                        .setDescription(`serv bl <t:${parseInt(BlacklistUserData.Time / 1000)}:R>, reason ${BlacklistUserData.Reason}`)
                ]
            })

            if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply
                (interaction, "⁉️", `You need \`${command.UserPerms.join(", ")}\`permissions to execute com`, true)
            if (command.BotPerms && command.BotPerms.length !== 0) if (!member.permissions.has(command.BotPerms)) return Reply
                (interaction, "⁉️", `I need \`${command.BotPerms.join(", ")}\`permissions to execute com`, true)
            command.execute(interaction, client, args)
        } else
            if (interaction.isSelectMenu()) {
                if (interaction.customId == 'reaction-roles' && member instanceof GuildMember) {
                    const component = interaction.component
                    const removed = component.options.filter((option) => {
                        return !values.includes(option.value)
                    })
                    for (const id of removed) {
                        member.roles.remove(id.value)
                    }
                    for (const id of values) {
                        member.roles.add(id)
                    }
                    interaction.reply({
                        content: 'roles upd', ephemeral: true
                    })
                }
            }

    }
}