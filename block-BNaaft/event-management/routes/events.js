var express = require('express');
var router = express.Router();
var Event = require("../models/event")
var Remark = require("../models/event")
var lodash = require('lodash');
var moment = require("moment");
/* GET home page. */
router.get('/new', function (req, res, next) {
    res.render('eventForm');
});

//form
router.post('/', function (req, res, next) {
    req.body.category = req.body.category.split(" ");
    console.log(req.body);
    Event.create(req.body, (err, event) => {
        if (err) return next(err);
        res.redirect("/events")
    })
});
//list
router.get('/', function (req, res, next) {
    Event.find({}, (err, events) => {
        if (err) return next(err);
        const categories = events.reduce((acc, ele) => {
            acc = acc.concat(ele.category);
            return acc;
        }, []);
        var uniqueCategories = [...new Set(categories)];
        var locations = events.map(ele => { return ele.location });
        let uniqueLocations = [...new Set(locations)];
        console.log(events,uniqueCategories,uniqueLocations);
        res.render("events", { events, uniqueCategories, uniqueLocations })
    })
});

//detail page
router.get("/:id", (req, res, next) => {
    var id = req.params.id;
    Event.findById(id).populate("remarkId").exec((err, event) => {
    const startDate = moment(event.start_date).format('MMM Do YY');
    const endDate = moment(event.end_date).format('MMM Do YY');
        if (err) return next(err);
        res.render("eventsDetail", { event,startDate,endDate })
    })
})
//edit event
router.get("/:id/edit", (req, res, next) => {
    var id = req.params.id;
    Event.findById(id, (err, event) => {
        const startDate = moment(event.start_date).format('MMM Do YY').replaceAll(' ', '-');
        const endDate = moment(event.end_date).format('MMM Do YY').replaceAll(' ', '-');
        if (err) return next(err);
        console.log(startDate,endDate);
        res.render("editEvent", { event,startDate,endDate })
    })
})
//update event
router.post("/:id/update", (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndUpdate(id, req.body, (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + id)
    })
})

//delete event
router.get("/:id/delete", (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndDelete(id, req.body, (err, event) => {
        if (err) return next(err);
        Remark.deleteMany({ eventId: id }, (err, remark) => {
            res.redirect("/events")
        })

    })
})

//sort by category
router.get("/:category/sortbycategory", (req, res, next) => {
    var category = req.params.category;
    Event.find({ category: category }, (err, events) => {
        if (err) return next(err);
        Event.find({}, (err, event) => {
            const categories = event.reduce((acc, ele) => {
                acc = acc.concat(ele.category);
                return acc;
            }, []);
            var uniqueCategories = [...new Set(categories)];
            var locations = events.map(ele => { return ele.location });
            let uniqueLocations = [...new Set(locations)];
            res.render("events", { events, uniqueCategories,uniqueLocations})
        })
    })
})
router.get("/:location/sortbylocation", (req, res, next) => {
    var location = req.params.location;
    Event.find({ location: location }, (err, events) => {
        if (err) return next(err);
        Event.find({}, (err, event) => {
            const categories = event.reduce((acc, ele) => {
                acc = acc.concat(ele.category);
                return acc;
            }, []);
            var uniqueCategories = [...new Set(categories)];
            var locations = events.map(ele => { return ele.location });
            let uniqueLocations = [...new Set(locations)];
            res.render("events", { events, uniqueCategories,uniqueLocations})
        })
    })
})

//sort by date
router.get('/sortby/date', async (req, res, next) =>{
     Event.find({}).sort({'start_date':1}).exec((err,events)=>{
        const categories = events.reduce((acc, ele) => {
            acc = acc.concat(ele.category);
            return acc;
        }, []);
        var uniqueCategories = [...new Set(categories)];
        var locations = events.map(ele => { return ele.location });
        let uniqueLocations = [...new Set(locations)];
        res.render("events", { events, uniqueCategories,uniqueLocations})
     })   
})

module.exports = router;
