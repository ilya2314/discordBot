const { Client, Partials, Collection, EmbedBuilder } = require("discord.js");
const { User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent } = Partials;
const ms = require('ms')
const { REST } = require('@discordjs/rest');

const { loadCommands } = require('./Handlers/commandHandler');
const { loadEvents } = require("./Handlers/eventHandlers")
const { errorHandler } = require('./Handlers/errorHandler')

require('dotenv').config();

const client = new Client({
    intents: 131071,
    partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent],
    allowedMentions: { parse: ['everyone', 'roles', 'users'] },
    rest: { timeout: ms('1m') }
});

client.commands = new Collection()
client.config = require('../config.json');
client.voiceGenerator = new Collection();

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