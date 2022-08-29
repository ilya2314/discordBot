const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js");
const EditReply = require('../../Systems/EditReply');
const DBG = require('../../Schemas/BlacklistG')
const DBU = require('../../Schemas/BlacklistU')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("blacklist")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) =>
            options.setName("options").setDescription("options")
                .setChoices(
                    {
                        name: 'Server',
                        value: 'server'
                    },
                    {
                        name: 'Member',
                        value: 'member'
                    }
                ).setRequired(true))
        .addStringOption((options) =>
            options.setName("id").setDescription("id")
                .setRequired(true))
        .addStringOption((options) =>
            options.setName("reason").setDescription("reason")
                .setRequired(false)),

    /**
         * @param {Client} client
         * @param {ChatInputCommandInteraction} interaction
         */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user } = interaction


        if (user.id !== '254646128753115136') return EditReply(interaction, '🚫', 'comm is classified')

        const Options = options.getString('options')
        const ID = options.getString('id')
        const Reason = options.getString('reason') || 'no reason'

        if (isNaN(ID)) return EditReply(interaction, '🚫', 'supposed')

        switch (Options) {
            case "server": {
                const Guild = client.guilds.cache.get(ID)

                let GName
                let GID

                if (Guild) {
                    GName = Guild.name
                    GID = Guild.id
                } else {
                    GName = 'unknown'
                    GID = ID
                }


                let Data = await DBG.findOne({ Guild: GID }).catch(err = {})

                if (!Data) {
                    Data = new DBG({
                        Guild: GID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, `✅`, `add ${GName} (${GID}) in bl -> ${Reason}`)
                } else {
                    await Data.delete()

                    EditReply(interaction, `✅`, `rem ${GName} (${GID}) in bl`)
                }
            }
                break;
            case "member":
                {
                    let Member
                    let Mname
                    let MID

                    const User = client.users.cache.get(ID)

                    if (User) {
                        Member = User
                        Mname = User.tag
                        MID = User.id
                    } else {
                        Member = 'unknown user'
                        Mname = 'unknown user'
                        MID = ID
                    }

                    let Data = await DBU.findOne({ User: MID }).catch(err => console.log(err))

                    if (!Data) {
                        Data = new DBU({
                            User: MID,
                            Reason,
                            Time: Date.now()
                        })

                        await Data.save()

                        EditReply(interaction, `✅`, `add ${Member} (${Mname} | ${MID}) in bl -> ${Reason}`)
                    } else {
                        await Data.delete()

                        EditReply(interaction, `✅`, `rem {Member} (${Mname} | ${MID}) in bl`)
                    }
                }
                break;
        }
    }
}