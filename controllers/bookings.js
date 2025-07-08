const Booking = require("../models/booking");




module.exports.renderNewBooking = (req, res) => {
    res.render("bookings/new.ejs");
}