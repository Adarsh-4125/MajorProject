const Listing = require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings} );
}

module.exports.renderNewForm =(req, res) => {
    console.log("req.user", req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id)
    .populate({path:"reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    //console.log("listing", listing);
    res.render("listings/show.ejs", { listing } );
}

module.exports.createListing = async (req, res) => {
        
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send()


        let newListing=new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = [];

        if(req.files && req.files.length > 0) {
            req.files.forEach(file => {
                newListing.image.push({
                    url: file.path,
                    filename: file.filename
                });
            });
        }

        newListing.submittedAt = new Date();
        newListing.category = req.body.listing.category;

        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log("savedListing", savedListing);
        req.flash("success", "Successfully created a new listing!");
        // console.log("newListing", newListing);
        res.redirect("/listings");
   }

module.exports.renderEditForm = async (req, res, next) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image[0].url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250/");
    res.render("listings/edit.ejs", {listing, originalImageUrl} );
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (req.body.listing.image) {
        delete req.body.listing.image;
    }
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            listing.image = listing.image.filter(img => img.filename !== filename);
        }

        await listing.save();
    }

    if(req.files) {
        req.files.forEach(file => {
            listing.image.push({
                url: file.path,
                filename: file.filename
            })
        })
        await listing.save();
    }
    listing.submittedAt = Date.now();
    await listing.save();
    req.flash("success", "Successfully updated the listing!");
    //console.log("updated listing", req.body.listing);
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    await User.updateMany(
  {},
  { $pull: { recentViews: deletedListing._id } }
);
    //console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect(`/listings`);
}

module.exports.searchListing = async (req, res) => {
    let { q } = req.query;
    let allListings;
    if (q) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                {country : { $regex: q, $options: 'i' } },
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    if(allListings.length === 0) {
        req.flash("error", "No listings found!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings, q });
}

module.exports.filterListings = async (req, res) => {
    let { category } = req.query;
    let allListings;
    if (category) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, category });
}

module.exports.recommendations = async (req, res) => {
    let recommendations = [];
    const allListings = await Listing.find({});
    if (req.user && req.user.recentCategories && req.user.recentCategories.length > 0) {
        // Find listings in the user's recently viewed categories, excluding ones they've already viewed
        recommendations = await Listing.find({
            category: { $in: req.user.recentCategories },
            _id: { $nin: req.user.recentViews }
        }).limit(5);
    } else {
        // Fallback: show latest listings
        recommendations = await Listing.find({}).sort({ createdAt: -1 }).limit(5);
    }
    if(recommendations.length === 0) {
        req.flash("error", "No recommendations found!");
        return res.redirect("/listings");
    }
    res.render('listings/recommendations', { recommendations, allListings });
};