const { model, Schema } = require("mongoose");

module.exports = model("commands", new Schema({
    command: [String],

}))