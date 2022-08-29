const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { loadCommands } = require('../../Handlers/commandHandler');
const { loadEvents } = require("../../Handlers/eventHandlers")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("reload")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
            options.setName("events").setDescription("events"))
        .addSubcommand((options) =>
            options.setName("commands").setDescription("commands")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "events":
                loadEvents(client);
                interaction.reply({ content: "reload ev" })
                break;
            case "commands":
                loadCommands(client);
                interaction.reply({ content: "reload com" })
                break;
            default:
                break;
        }


    }
}