const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log("req.path", req.originalUrl);
    if(!req.isAuthenticated()) {
        //redirectUrl save the original URL to redirect after login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currentUser._id)){
            req.flash("error", "You are not Owner this listing!");
            return res.redirect(`/listings/${id}`);
        };
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        console.log(error);
        if (error) {
            let errorMessage = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errorMessage);
        } else {
            next();
        }
    }

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
        console.log(error);
        if (error) {
            let errorMessage = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errorMessage);
        } else {
            next();
        }
    }

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not Author of this review!");
        return res.redirect(`/listings/${id}`);
    };
    next();
}