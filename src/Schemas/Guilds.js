const { model, Schema } = require("mongoose");

module.exports = model("guilds", new Schema({
    guild: String,

}))