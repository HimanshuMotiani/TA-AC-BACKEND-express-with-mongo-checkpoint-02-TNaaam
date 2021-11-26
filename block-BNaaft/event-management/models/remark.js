var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var remarksSchema = new Schema({
    title: String,
    content:{type: String, required: true},
    author: String,
    likes: { type: Number, default: 0 },
    eventId:{type:Schema.Types.ObjectId,ref:"Event"}
}, { timestamps: true })

var Remark = mongoose.model("Remark",remarksSchema)

module.exports = Remark;