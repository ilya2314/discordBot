const { EmbedBuilder, SelectMenuBuilder, Client, Message,
    SlashCommandBuilder, ApplicationCommandType,
    CommandInteraction, ChatInputCommandInteraction, ComponentType } = require('discord.js')
const { readdirSync } = require('fs')
require('dotenv').config()
const prefix = '&'
const color = 'Red'
const { create_mh } = require(`../../functions/menu`)
const EditReply = require("../../Systems/EditReply")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help'),
    /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {String[]} args
    * @param {Client} client
    * @param {Message} message
    */

    async execute(message, cmd, args, client, interaction) {


        try {
            let categories = []
            let cots = []

            if (!args[0]) {
                let ignored = ['simulation']

                const emojiA = 'A'
                const emojiB = 'B'
                const emojiC = 'C'
                const emojiD = 'D'
                const emojiE = 'E'
                const emojiF = 'F'
                const emojiG = 'G'
                const emojiH = 'H'
                const emojiI = 'I'
                const emojiJ = 'J'
                const emojiK = 'K'
                const emojiL = 'L'

                const emo = {
                    Community: `${emojiA}`,
                    Information: `${emojiC}`,
                    Moderation: `${emojiB}`,
                    Utility: `${emojiE}`,
                    Owner: `${emojiK}`,
                    Public: `${emojiG}`,
                    Developer: `${emojiJ}`,
                    Context: `${emojiL}`,
                }

                let ccate = []

                readdirSync('./src/Commands/').forEach((dir) => {
                    if (ignored.includes(dir.toLowerCase())) return

                    const commands = readdirSync(`./src/Commands/${dir}`).filter((file) => file.endsWith('.js'))

                    if (ignored.includes(dir.toLowerCase())) return

                    const name = `${emo[dir]} - ${dir}`
                    let nome = dir.toUpperCase()
                    let cats = new Object()

                    cats = {
                        name: name,
                        value: `\`${prefix}help ${dir.toLowerCase()}\``,
                        inline: true
                    }
                    categories.push(cats)
                    ccate.push(nome)
                })

                const helpEmbed = new EmbedBuilder()
                    .setTitle(`Bot com`)
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                    .setDescription(`Prefix ${prefix}\n\n help commands`)
                    .addFields({ name: `\u200B`, value: 'Categories' })
                    .addFields(categories)
                    .addFields({ name: `\u200B`, value: `\u200B` })
                    .addFields({
                        name: `\u200B`, value: `${emojiH} [invite], ${emojiI} [support],
                    ${emojiG} [vote], ${emojiJ} [webpage],`
                    })
                    .setFooter({ text: 'help' })
                    .setTimestamp().setColor(color)

                const menus = create_mh(ccate)
                return message.reply({ embeds: [helpEmbed], components: menus.smenu }).then((msgg) => {
                    const menuID = menus.sid
                    const select = async (interaction) => {
                        if (interaction.customId != menuID) return

                        let { values } = interaction
                        let value = values[0]
                        let catts = []

                        readdirSync('./src/Commands/').forEach((dir) => {
                            if (dir.toLowerCase() !== value.toLowerCase()) return
                            const commands = readdirSync(`./src/Commands/${dir}/`).filter((file) =>
                                file.endsWith('.js'))

                            const cmds = commands.map((command) => {
                                let file = require(`../../Commands/${dir}/${command}`)
                                if (!file.name) return 'No command name'
                                let name = file.name.replace('.js', '')
                                if (client.commands.get(name).hidden) return

                                let des = client.commands.get(name).description
                                let emo = client.commands.get(name).emoji
                                let emoe = emo ? `${emo} - ` : ``

                                let obj = {
                                    cname: `${emoe}\`${name}\``, des
                                }
                                return obj
                            })

                            let dota = new Object()

                            cmds.map(co => {
                                if (co == undefined) return
                                dota = {
                                    name: `${cmds.length === 0 ? 'in prog' : co.cname}`,
                                    value: co.des ? co.des : 'no desc',
                                    inline: true
                                }
                                catts.push(dota)
                            })
                            cots.push(dir.toLowerCase())
                        })

                        if (cots.includes(value.toLowerCase())) {
                            const combed = new EmbedBuilder()
                                .setTitle(`${value.charAt(0).toUpperCase() + value.slice(1)} commands`)
                                .setDescription(`Use ${prefix}help`)
                                .addFields(catts).setColor(color)

                            await interaction.deferUpdate()

                            return interaction.message.edit({
                                embeds: [combed],
                                components: menus.smenu
                            })
                        }
                    }

                    const filter = (interaction) => {
                        return !interaction.user.bot && interaction.user.id
                    }

                    const collector = msgg.createMessageComponentCollector({
                        filter, componentType: ComponentType.SelectMenu
                    })
                    collector.on('collect', select)
                    collector.on('end', () => null)
                })
            } else {
                let catts = []

                readdirSync('./src/Commands/').forEach((dir) => {
                    if (dir.toLowerCase() !== args[0].toLowerCase()) return
                    const commands = readdirSync(`./src/Commands/${dir}/`).filter((file) => file.endsWith('.js'))

                    const cmds = commands.map((command) => {
                        let file = require(`../../Commands/${dir}/${command}`)
                        if (!file.name) return 'no com name'
                        let name = file.name.replace('.js', '')
                        if (client.commands.get(name).hidden) return

                        let des = client.commands.get(name).description
                        let emo = client.commands.get(name).emoji
                        let emoe = emo ? `${emo} - ` : ``

                        let obj = {
                            cname: `${emoe}\`${name}\``, des
                        }
                        return obj
                    })

                    let dota = new Object()

                    cmds.map(co => {
                        if (co == undefined) return
                        dota = {
                            name: `${cmds.length === 0 ? 'in prog' : co.cname}`,
                            value: co.des ? co.des : 'no desc',
                            inline: true
                        }
                        catts.push(dota)
                    })
                    cots.push(dir.toLowerCase())
                })

                const command = client.commands.get(args[0].toLowerCase()) ||
                    client.commands.find(
                        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                    )

                if (cots.includes(args[0].toLowerCase())) {

                    const combed = new EmbedBuilder()
                        .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} commands`)
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Prefix ${prefix}\n\n help commands`)
                        .setTimestamp()
                        .setFooter('help')
                        .addFields(catts)
                        .setColor(color)

                    return message.reply({
                        embeds: [combed]
                    })
                }
                if (!command) {
                    const embed = new EmbedBuilder()
                        .setTitle(`Invalid commands`)
                        .setColor('Red')

                    return await message.reply({
                        embeds: [embed],
                        allowedMentions: {
                            repliedUser: false
                        },
                    })
                }

                const embed = new EmbedBuilder()
                    .setTitle(`com details`)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .addFields({ name: 'Command', value: command.name ? `\`${command.name}\`` : 'no name provided for com' })
                    .addFields({ name: 'Aliases', value: command.aliases ? `\`${command.aliases.join("` `")}\`` : 'no aliases provided for com' })
                    .addFields({ name: 'Usage', value: command.usage ? `\`${command.usage}\`` : 'no usage provided for com' })
                    .addFields({ name: 'Command description', value: command.description ? command.description : 'no description provided for com' })
                    .setFooter('help')
                    .setTimestamp().setColor(color)

                return await message.reply({
                    embeds: [embed]
                })
            }
        } catch (err) {

            const errEmbed = new EmbedBuilder()
                .setColor('#3d35cc')
                .setDescription('error, pls try again')

            message.reply({ embeds: [errEmbed] })

            console.log(err);
        }
    }
}