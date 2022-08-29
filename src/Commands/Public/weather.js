const weather = require('weather-js');
const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather').setDescription('weather')
        .addStringOption((options) => options
            .setName('location').setDescription('location').setRequired(true)),
    /**
       * @param {ChatInputCommandInteraction} interaction
       * @param {Client} client
       */
    async execute(interaction, client, args) {
        await interaction.deferReply({ ephemeral: false })
        const { options } = interaction
        const loc = options.getString("location");

        weather.find({ search: loc, degreeType: "C" }, function (error, result) {
            const errEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription("**⛔ You didn't specify a valid location**")

            if (result === undefined || result.length === 0) return interaction.reply({ embeds: [errEmbed] });
            if (error) console.log(error);
            const current = result[0].current
            const location = result[0].location

            const embed = new EmbedBuilder()
                .setTitle(`Showing the Weather Info for ${current.observationpoint}`)
                .setDescription(current.skytext)
                .setThumbnail(current.imageUrl)
                .setColor("#FF0000")
                .setTimestamp()
                .addFields(
                    {
                        name: "Temperature: ", value: current.temperature + "°C", ephemeral: true
                    },
                    {
                        name: "Wind Speed: ", value: current.winddisplay, ephemeral: true
                    },
                    {
                        name: "Humidity: ", value: `${current.humidity}%`, ephemeral: true
                    },
                    {
                        name: "Timezone: ", value: `UTC${location.timezone}`, ephemeral: true
                    },
                )
                .setFooter({ text: "hhhh" })

            interaction.followUp({ embeds: [embed] })
        })

    }
}