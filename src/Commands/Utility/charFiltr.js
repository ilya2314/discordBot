const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const sourcebin = require("sourcebin");
const Schema = require('../../Schemas/Filter');
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('filter')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand((options) => options
            .setName('help')
            .setDescription('help'))
        .addSubcommand((options) => options
            .setName('clear')
            .setDescription('clear bl'))
        .addSubcommand((options) => options
            .setName('list')
            .setDescription('list'))
        .addSubcommand((options) => options
            .setName('settings')
            .setDescription('setup')
            .addChannelOption((options) => options
                .setName('logging')
                .setDescription('logging')
                .setRequired(true)))
        .addSubcommand((options) => options
            .setName('configure')
            .setDescription('configure')
            .addStringOption((options) => options
                .setName('options')
                .setDescription('options')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' },
                ))
            .addStringOption((options) => options
                .setName('word')
                .setDescription('word')
                .setRequired(true))
        ),
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { guild, options } = interaction;

        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case "help":
                const Embed = new EmbedBuilder().setColor('Green')
                    .setDescription([
                        "conf", "clear"
                    ].join("\n"));
                interaction.editReply({
                    embeds: [Embed]
                });
                break;
            case "list":
                const Data = await Schema.findOne({ Guild: guild.id });
                if (!Data)
                    return interaction.editReply({
                        content: `No data bl`
                    });

                await sourcebin.create(
                    [
                        {
                            content: `${Data.Words.map((w) => w).join("\n") || "none"}`,
                            language: "text",
                        },
                    ],
                    {
                        title: `${guild.name} | blacklist`,
                        description: "Whatever",
                    }
                ).then((bin) => {
                    interaction.editReply({ content: bin.url });
                });

                break;
            case "clear":
                await Schema.findOneAndUpdate({ Guild: guild.id }, { Words: [] });
                client.filters.set(guild.id, []);
                interaction.editReply({
                    content: `Cleard bl`
                }); break;
            case "settings":
                const loggingChannel = options.getChannel("logging").id;

                await Schema.findOneAndUpdate(
                    { Guild: guild.id },
                    { Log: loggingChannel },
                    { new: true, upsert: true },
                );

                client.filtersLog.set(guild.id, loggingChannel);

                interaction.editReply({
                    content: `Added <#${loggingChannel}> log channel`,
                    ephemeral: true
                });
                break;
            case "configure":
                const Choice = options.getString("options");
                const Words = options.getString("word").toLowerCase().split(",");

                switch (Choice) {
                    case "add":
                        Schema.findOne({ Guild: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) {
                                await Schema.create({
                                    Guild: guild.id,
                                    Log: null,
                                    Words: Words,
                                });

                                client.filters.set(guild.id, Words);

                                interaction.editReply({
                                    content: `Added ${Words.length} to bl`
                                });
                            }
                            const newWords = [];

                            Words.forEach((w) => {
                                if (data.Words.includes(w)) return;
                                newWords.push(w);
                                data.Words.push(w);
                                client.filters.get(guild.id).push(w);
                            });
                            interaction.editReply({
                                content: `Added ${newWords.length} to bl`
                            });
                            data.save();
                        });
                        break;
                    case "remove":
                        Schema.findOne({ Guild: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) {
                                return interaction.followUp({
                                    content: `Data no remove`
                                });
                            }
                            const removedWords = [];

                            Words.forEach((w) => {
                                if (!data.Words.includes(w)) return;
                                data.Words.remove(w);
                                removedWords.push(w);
                            });
                            const newArray = await client.filters.get(guild.id)
                                .filter((word) => !removedWords.includes(word));
                            client.filters.set(guild.id, newArray);

                            EditReply(interaction, '👌',
                                `Removed ${removedWords.length} from bl`
                            );
                            data.save();
                        });
                        break;
                }
                break;
        }
    },
};