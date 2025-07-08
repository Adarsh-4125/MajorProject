const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const User = require('./models/user.js');

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


module.exports.trackView = async (req, res, next) => {
    if (req.user && req.params.id) {
        const listing = await Listing.findById(req.params.id);
        if (listing) {
            // Fetch the latest user from DB
            const user = await User.findById(req.user._id);

            // Ensure arrays exist
            if (!user.recentViews) user.recentViews = [];
            if (!user.recentCategories) user.recentCategories = [];

            // Add to recentViews if not present
            if (!user.recentViews.includes(listing._id)) {
                let recentListing = user.recentViews.push(listing._id);
                console.log("recentListing", recentListing);
                if (user.recentViews.length > 10) {
                    user.recentViews = user.recentViews.slice(-10);
                }
            }

            // Add to recentCategories if not present
            if (!user.recentCategories.includes(listing.category)) {
                user.recentCategories.push(listing.category);
                if (user.recentCategories.length > 10) {
                    user.recentCategories = user.recentCategories.slice(-10);
                }
            }

            await user.save();
        }
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect("/listings");
    }
    next();
}