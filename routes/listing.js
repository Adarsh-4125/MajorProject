const express  = require('express')
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage});
const { trackView } = require('../middleware');


router
.route("/")
.get(wrapAsync(listingsController.index)) // index route
.post( 
    isLoggedIn,
    upload.array('listing[image]',3), // allow up to 3 images
    validateListing,
    wrapAsync(listingsController.createListing)  // create route
)

router.get("/cat", wrapAsync(listingsController.filterListings)); // category route

router.get("/search", wrapAsync(listingsController.searchListing)); // search route

router.get("/about", (req, res) => {
    res.render("listings/about");
}); // about route



// new route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router.get('/recommendations', isLoggedIn, listingsController.recommendations);

router
.route('/:id')
.get( trackView,wrapAsync(listingsController.showListing)) // show route
.put( 
    isLoggedIn,
    isOwner,
    upload.array('listing[image]',3),
    validateListing,
     wrapAsync(listingsController.updateListing)
    ) // update route
.delete( 
    isLoggedIn,
    isOwner, 
    wrapAsync(listingsController.destroyListing)
);// delete route


// edit route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm)
);


module.exports = router;