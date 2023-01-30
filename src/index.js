const { Client, Partials, Collection, EmbedBuilder } = require("discord.js");
const { User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent } = Partials;
const ms = require('ms')
const { REST } = require('@discordjs/rest');

const { loadCommands } = require('./Handlers/commandHandler');
const { loadEvents } = require("./Handlers/eventHandlers")
const { errorHandler } = require('./Handlers/errorHandler')


const UsersDB = require('./Schemas/Users')
const GuildsDB = require('./Schemas/Guilds')
const CommandsDB = require('./Schemas/Commands')



const client = new Client({
    intents: 131071,
    partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent],
    allowedMentions: { parse: ['everyone', 'roles', 'users'] },
    rest: { timeout: ms('1m') }
});

client.commands = new Collection()
client.config = require('dotenv').config();
client.voiceGenerator = new Collection();

client.Wargamer = require('../src/functions/wargamer')
client.functions = require("../src/functions/functions.js");
client.databases = [
    UsersDB.findOne('user'),
    GuildsDB.findOne('guild'),
    CommandsDB.findOne('command'),
];
client.realms = require('../src/functions/realms.json');

client.filters = new Collection();
client.filtersLog = new Collection();

require(`./Systems/ChatFilter`)(client);


client.color = "Blue"

module.exports = client

client.login(process.env.TOKEN)
    .then(() => {
        loadEvents(client);
        loadCommands(client);
        errorHandler(client);

    })
    .catch((err) => console.log(err))