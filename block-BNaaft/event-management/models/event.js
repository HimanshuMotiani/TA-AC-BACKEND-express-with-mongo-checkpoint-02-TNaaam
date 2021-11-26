var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    title: {type:String,require:true},
    summary: String,
    host: String,
    start_date: Date,
    end_date: Date,
    category: [String],
    location: String,
    likes: { type: Number, default: 0 },
    remarkId:[{type:Schema.Types.ObjectId,ref:"Remark"}]
}, { timestamps: true })

var Event = mongoose.model("Event",eventsSchema)

module.exports = Event;
