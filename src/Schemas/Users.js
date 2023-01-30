const { model, Schema } = require("mongoose");

module.exports = model("users", new Schema({
    user: String,

}))