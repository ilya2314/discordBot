const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { connection } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status').setDescription('status'),
    /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false })
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);


        const Response = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(
                `   **Bot Status**
            \n **Client**: \`🟢 Online!\`
            \n **Database**: \`${switchTo(connection.readyState)}\`
            \n **Client Ping**: \`${client.ws.ping}ms\`
            \n **Message Ping**: \` ${Date.now() - interaction.createdTimestamp}ms \`
            \n **Uptime**: ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`)

        interaction.followUp({ embeds: [Response] });

    }
}

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0: status = `🔴 Disconnected!`
            break;
        case 1: status = `🟢 Connceted!`
            break;
        case 2: status = `🟠 Connecting!`
            break;
        case 3: status = `🟠 Disconnecting!`
            break;
    }
    return status;
}