require('dotenv').config()
const { Client, SlashCommandBuilder, GatewayIntentBits,
    EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
const { getVoiceConnections, joinVoiceChannel } = require('@discordjs/voice')

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join')
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const voiceChannel = interaction.options.getChannel('channel');
        const voiceCon = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });
    }
}