const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, Message, EmbedBuilder } = require("discord.js");


module.exports = {

    data: new SlashCommandBuilder()
        .setName('link').setDescription('link')
        /*.addStringOption((option) => option
            .setName('seni').setDescription('searchNickname').setRequired(true))*/,
    /**
     * @param {Message} message
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */

    async execute(message, args, utils, client) {



        // if an account is already linked
        if (utils.usersData[0].wot !== "unknow") {
            return message.error("account/link:ALREADY_LINKED", {
                prefix: utils.guildData.prefix
            });
        }

        // if no realm is provided
        if (!args[0]) {
            return message.error("account/link:MISSING_REALM");
        }
        let realm = client.realms.find((r) => r.name === args[0] || r.aliases.includes(args[0]));
        if (!realm) {
            return message.error("account/link:INVALID_REALM", {
                realm: args[0]
            });
        }

        // if no nickname is provided
        if (!args[1]) {
            return message.error("account/link:MISSING_NICKNAME");
        }

        let m = await message.sendT("account/link:SEARCHING");

        client.Wargamer.findPlayer({ search: args.slice(1).join(" "), realm: args[0] }).then((player) => {
            m.sendT("account/link:SUCCESS", {
                prefix: utils.guildData.prefix
            }, true, null, "success");
            return client.databases[0].set(message.author.id + ".wot", player);
        }).catch((_err) => {
            return m.error("account/link:ACCOUNT_NOT_FOUND", {
                search: args.slice(1).join(" ")
            }, true);
        });

    }

};
