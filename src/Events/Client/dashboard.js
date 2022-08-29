const { Client, ChannelType } = require('discord.js')
const CaprihamTheme = require('dbd-capriham-theme')
const DBD = require('discord-dashboard')
const welcomeDB = require('../../Schemas/welcome')
const GeneralLogsDB = require('../../Schemas/LogsChannel')
const LogsSwitchDB = require('../../Schemas/GeneralLogs')

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {

        const { user } = client

        let Information = []
        let Moderation = []

        const info = client.commands.filter(x => x.category === 'Information')
        const mod = client.commands.filter(x => x.category === 'Moderation')

        CommandPush(info, Information)
        CommandPush(mod, Moderation)

        await DBD.useLicense("2193e894-5450-44de-aca1-8fa759192461")
        DBD.Dashboard = DBD.UpdatedClass()

        const Dashboard = new DBD.Dashboard({
            port: 80,
            client: {
                id: '828467706205962292',
                secret: '_VRGEBNQN-72-ccvBFRa9rWP4TDHt5C6'
            },
            redirectUri: 'http://localhost/discord/callback',
            domain: 'http://localhost',
            bot: Client,
            supportServer: {
                slash: '/support',
                inviteUrl: 'https://discord.gg/vqJbWBxFWv'
            },
            acceptPrivacyPolicy: true,
            minimizedConsoleLogs: true,
            guildAfterAuthorization: {
                use: true,
                guildId: '780768720074833930'
            },
            invite: {
                clientId: client.user.id,
                scopes: ['bot', 'applications.commands', 'guilds', 'identify'],
                permissions: '8',
                redirectUri: 'https://discord.gg/vqJbWBxFWv',
            },
            theme: CaprihamTheme({
                websiteName: "Assistants",
                iconURL: 'https://assistants.ga/ac_logo_v6.png',
                index: {
                    card: {
                        title: "Assistants - The center of everything",
                        description: "Assistants Discord Bot management panel. Assistants Bot was created to give others the ability to do what they want. Just.<br>That's an example text.<br><br><b><i>Feel free to use HTML</i></b>",
                        //image: "https://www.geeklawblog.com/wp-content/uploads/sites/528/2018/12/liprofile-656x369.png",
                    },
                    information: {
                        title: "Information",
                        description: "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>.<br><br><b><i>You can use HTML there</i></b>"
                    },
                    feeds: {
                        title: "Feeds",
                        list: [
                            {
                                icon: "fa fa-user",
                                text: "New user registered",
                                timeText: "Just now",
                                bg: "bg-light-info"
                            },
                            {
                                icon: "fa fa-server",
                                text: "Server issues",
                                timeText: "3 minutes ago",
                                bg: "bg-light-danger"
                            }
                        ]
                    }
                },
                commands: [
                    {
                        category: `Information`,
                        subTitle: `Information commands`,
                        aliasesDisabled: false,
                        list: Information
                    },
                    {
                        category: `Moderation`,
                        subTitle: `Moderation commands`,
                        aliasesDisabled: false,
                        list: Moderation
                    },
                ],
            }),
            settings: [
                {
                    categoryId: 'welcome',
                    categoryName: 'welcomeSys',
                    categoryDescription: 'setup welcomeSys',
                    categoryOptionsList: [
                        {
                            optionId: 'welch',
                            optionName: 'welck ch',
                            optionDescription: 'set or reset welck',
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null
                                if (!data) {
                                    data = new welcomeDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })
                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'weldm',
                            optionName: 'welck dm',
                            optionDescription: 'en or dis cont',
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DM
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new welcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: newData,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })
                                    await data.save()
                                } else {
                                    data.DM = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'weldmopt',
                            optionName: 'welck dm',
                            optionDescription: 'send cont',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Content
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new welcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: newData,
                                        Embed: false
                                    })
                                    await data.save()
                                } else {
                                    data.Content = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'welcembed',
                            optionName: '',
                            optionDescription: 'send embed',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Embed
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new welcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: newData
                                    })
                                    await data.save()
                                } else {
                                    data.Embed = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'weldmmsg',
                            optionName: 'welck dm',
                            optionDescription: 'send cont',
                            optionType: DBD.formTypes.embedBuilder({
                                username: user.username,
                                avatarURL: user.avatarURL(),
                                defaultJson: {
                                    content: 'Welcome',
                                    embed: {
                                        description: 'Welcome'
                                    }
                                }
                            }),
                            getActualSet: async ({ guild }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DMMessage
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await welcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new welcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: newData,
                                        Content: false,
                                        Embed: false
                                    })
                                    await data.save()
                                } else {
                                    data.DMMessage = newData
                                    await data.save()
                                }
                                return
                            }
                        }
                    ],
                },
                {
                    categoryId: 'logs',
                    categoryName: 'logSys',
                    categoryDescription: 'setup logSys',
                    categoryOptionsList: [
                        {
                            optionId: 'gench',
                            optionName: 'gen log ch',
                            optionDescription: 'set or reset welck',
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = null
                                if (!data) {
                                    data = new GeneralLogsDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })
                                    await data.save()
                                } else {
                                    data.Channel = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'memrole',
                            optionName: 'config log ch',
                            optionDescription: 'mem role',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberRole
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberRole: newData,

                                    })
                                    await data.save()
                                } else {
                                    data.MemberRole = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'memnick',
                            optionName: '',
                            optionDescription: 'memnick',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberNick
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberNick: newData,

                                    })
                                    await data.save()
                                } else {
                                    data.MemberNick = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'chntpc',
                            optionName: '',
                            optionDescription: 'ch topic',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelTopic
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberNick: newData,

                                    })
                                    await data.save()
                                } else {
                                    data.MemberNick = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                        {
                            optionId: 'membst',
                            optionName: '',
                            optionDescription: 'membst',
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBoost
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (!newData) newData = false
                                if (!data) {
                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBoost: newData,

                                    })
                                    await data.save()
                                } else {
                                    data.MemberBoost = newData
                                    await data.save()
                                }
                                return
                            }
                        },
                    ],
                },
            ]
        })
        Dashboard.init();
    }
}

function CommandPush(filteredArray, CategoryArray) {
    filteredArray.forEach(obj => {
        let cmdObject = {
            commandName: obj.name,
            commandUsage: '/' + obj.name,
            commandDescription: obj.description,
            commandAlias: 'None'
        }
        CategoryArray.push(cmdObject)
    })
}