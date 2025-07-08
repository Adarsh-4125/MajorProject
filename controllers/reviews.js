const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async(req, res) => {
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log('new review saved',newReview);
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req, res)=> {
        let { id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId} })
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Successfully deleted the review!");
        //console.log(reviewId);
        res.redirect(`/listings/${id}`)
    }