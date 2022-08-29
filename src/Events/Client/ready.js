const { Client, ActivityType } = require("discord.js");
const ms = require('ms')
const mongoose = require('mongoose')
const mongodb = process.env.DATABASE

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client
     */
    async execute(client) {
        const { user, ws } = client
        console.log(` log${client.user.username}`);

        setInterval(() => {
            const ping = ws.ping
            user.setActivity({
                name: `ping: ${ping}ms`,
                type: ActivityType.Listening
            })
            user.setStatus('idle')
        }, ms('5s'));

        if (!mongodb) return

        mongoose.connect(mongodb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('con db')
        }).catch(err => console.log(err))
    }
}