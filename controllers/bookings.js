const Booking = require("../models/booking");
const Listing = require("../models/listing");



module.exports.renderNewBooking = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("bookings/new.ejs", {listing});
}

module.exports.createBooking = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect(`/listings/${id}`);
    }

    const {checkIn, checkOut, guests} = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if(checkInDate >= checkOutDate){
        req.flash("error","Check-in date must be before check-out date");
        return res.redirect(`/listings/${id}/book`);
    }

    if(checkInDate < new Date()){
        req.flash("error","Check-in date must be in the future");
        return res.redirect(`/listings/${id}/book`);
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: "pending",
    });

    await booking.save();
    req.flash("success", "Booking created successfully");
    res.redirect(`/bookings/${booking._id}/payment`);
}

module.exports.showBooking = async(req,res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
    .populate({
        path:"listing",
        populate: {path:"owner"}
    })
    .populate("user","username");

    if(!booking){
        req.flash("error","Booking doesn't exist");
        return res.redirect('/my-bookings');
    }

    if(!booking.user._id.equals(req.user._id)){
        req.flash("error", "You don't have permission to view this booking");
        return res.redirect('/my-bookings');
    }

    res.render("bookings/show", {booking});
}

module.exports.renderPayment = async(req,res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
    .populate({
        path:"listing",
        populate: {path:"owner"}
    })
    .populate("user","username");

    if(!booking){
        req.flash("error","Booking doesn't exist");
        return res.redirect('/my-bookings');
    }

    if(!booking.user._id.equals(req.user._id)){
        req.flash("error", "You don't have permission to view this booking");
        return res.redirect('/my-bookings');
    }

    res.render("bookings/payment", {booking});
}

module.exports.userBookings = async(req,res) => {
    const bookings = await Booking.find({user: req.user._id})
    .populate({
        path:'listing',
        populate:{
            path:'owner',
        }
    });

    if(bookings.length === 0){
        req.flash("error", "You don't have any bookings");
        return res.redirect("/listings");
    }
    //const listings = await Listing.find({_id: {$in: bookings.map(booking => booking.listing)}});
    res.render("bookings/index", {bookings});
}

module.exports.confirmPayment = async(req,res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate({
        path:'listing',
        populate: {path: 'owner'}
    }).populate('user','username');

    if(!booking){
        req.flash("error", "Booking not found");
        return res.redirect('/my-bookings');
    }

    // // Check if user owns this booking
    if(!booking.user._id.equals(req.user._id)){
        req.flash("error", "You don't have permission to confirm this booking");
        return res.redirect('/my-bookings');
    }

    // Update booking status to confirmed
    booking.status = "confirmed";
    await booking.save();

    req.flash("success", "Payment successful! Your booking is confirmed.");
    res.redirect(`/bookings/${booking._id}`);

}

module.exports.ownerBookings = async(req,res) => {
    const listings = await Listing.find({owner : req.user._id});
    const listingIds = listings.map(listing => listing._id);

    const bookings = await Booking.find({ listing : {$in: listingIds}})
          .populate('listing')
          .populate('user','username email')
          .sort({createdAt: -1});

    res.render("bookings/owner", { bookings, listings });
}

module.exports.cancelBooking = async(req,res) => {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/my-bookings");
}