var express = require('express');
var router = express.Router();
var Remark = require("../models/remark")
var Event = require("../models/event")

//add remark
router.post("/:id", (req, res) => {
    let eventId = req.params.id;
    req.body.eventId = eventId;
    Remark.create(req.body, (err, remark) => {
        Event.findByIdAndUpdate(eventId, { $push: { remarkId: remark.id } }, (err, event) => {
            if (err) return next(err);
            res.redirect("/events/" + eventId)
        })
    })
})
//edit remark
router.get("/:id/edit", (req, res) => {
    let remarksId = req.params.id;
    Remark.findById(remarksId, (err, remark) => {
        console.log(remark);
        res.render("editRemark",{remark})
    })
})
//update remark
router.post("/:id/update", (req, res) => {
    let remarksId = req.params.id;
        Remark.findByIdAndUpdate(remarksId,req.body, (err, remark) => {
            if (err) return next(err);
            res.redirect("/events/" + remark.eventId);
        })
})
//delete remark
router.get("/:id/delete", (req, res) => {
    
    let remarksId = req.params.id;
    console.log(remarksId);
        Remark.findByIdAndDelete(remarksId,(err, remark) => {
            if (err) return next(err);
            console.log(remark);
            Event.findByIdAndUpdate(remark.eventId,{$pull:{"remarkId":remarksId}},(err,event)=>{
                res.redirect("/events/" + remark.eventId);
            })
            
        })
})

//add likes
router.get("/:id/likes", (req, res) => {
    
    let remarksId = req.params.id;
        Remark.findByIdAndUpdate(remarksId,{$inc:{likes:1}},(err, remark) => {
            if (err) return next(err);
                res.redirect("/events/" + remark.eventId);
        })
})
module.exports = router