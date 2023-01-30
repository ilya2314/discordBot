const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, Message, EmbedBuilder } = require("discord.js");

const dateAndTime = require("date-and-time");
const pattern = dateAndTime.compile('MMM D YYYY');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile').setDescription('profile')
        .addStringOption((option) => option
            .setName('seni').setDescription('searchNickname').setRequired(true)),
    /**
     * @param {Message} message
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
    /*  // The name of the command
      name: "profile",
      // The name of the command folder, to detect the category
      dirname: __dirname,
      // Whether the command is enabled
      enabled: true,
      // The command aliases
      aliases: [ "profil" ],
      // The required permissions (for the bot) to execute the command
      clientPermissions: [ "EMBED_LINKS" ],
      // The level required to execute the command
      permLevel: "User",
      // The command cooldown
      cooldown: 2000,*/

    async execute(message, args, utils, client, interaction) {



        let m = await message.channel.send("misc:PLEASE_WAIT", null, false, null, "loading");

        let userData;
        // interaction.options.getString('seni');

        if (message.mentions.users.first()) {
            if (utils.usersData[1].wot === "unknow") {
                return m.error("account/unlink:NOT_LINKED_USER", {
                    user: message.mentions.users.first().tag
                }, true);
            } else {
                userData = utils.usersData[1].wot;
            }
        } else if (args[0]) {
            let realm = client.realms.find((r) => r.name === args[0].toLowerCase() || r.aliases.includes(args[0].toLowerCase()));
            if (!realm) return m.error("account/link:INVALID_REALM", {
                realm: args[0]
            }, true);
            if (!args[1]) return m.error("stats/profile:MISSING_NICKNAME", null, true);
            userData = await client.Wargamer.findPlayer({ search: args.slice(1).join(" "), realm: args[0].toLowerCase() }).catch(() => { });
            if (!userData) {
                return m.error("account/link:ACCOUNT_NOT_FOUND", {
                    search: args.slice(1).join(" ")
                }, true);
            }
        } else if (!args[0]) {
            if (utils.usersData[0].wot === "unknow") {
                return m.error("account/unlink:NOT_LINKED", {
                    prefix: utils.guildData.prefix
                });
            } else {
                userData = utils.usersData[0].wot;
            }
        }

        if (!userData) return;
        let stats = await client.Wargamer.getPlayerStats({ realm: userData.realm, ID: userData.ID }, true, false);

        let embed = new EmbedBuilder()
            .setColor(stats.wn8.color)
            .setFooter(utils.embed.footer, stats.realmData.iconURL)
            .setAuthor(stats.nickname, client.user.displayAvatarURL())
            .addFields(
                { name: "stats/profile:HEADER_NICKNAME", value: "[" + stats.nickname + "](https://ru.wot-life.com/ru/player/" + stats.nickname + "-" + userData.ID + ")", inline: true },
                /*{ name: "stats/profile:HEADER_CREATED", value: dateAndTime.format(new Date(stats.created_at * 1000), pattern), inline: true },
                { name: "stats/profile:HEADER_LAST_UPDATE", value: dateAndTime.format(new Date(stats.updated_at * 1000), pattern), inline: true },
                { name: "stats/profile:HEADER_LAST_BATTLE", value: (stats.last_battle_time > 0 ? dateAndTime.format(new Date(stats.last_battle_time * 1000), pattern) : "stats/profile:NO_BATTLES"), inline: true },
                { name: "stats/profile:HEADER_CLAN", value: (stats.clan_id) ? stats.clan.clan_tag : "stats/profile:NO_CLAN", inline: true },
                { name: "stats/profile:HEADER_WIN_RATE", value: (stats.statistics.all.battles > 0 ? client.functions.percentage(stats.statistics.all.wins, stats.statistics.all.battles) : "stats/profile:NO_BATTLES"), inline: true },
                { name: "stats/profile:HEADER_WN8", value: stats.wn8.now, inline: true },
                { name: "stats/profile:HEADER_WN8_24", value: stats.wn8["24h"], inline: true },
                { name: "stats/profile:HEADER_WN8_30", value: stats.wn8["30d"], inline: true },*/

            )

        m.edit("stats/profile:CONTENT", {
            nickname: stats.nickname
        }, embed);
    }

};


