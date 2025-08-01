const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  filename: String,
  url: {
    type: String,
    required: true,
  },
});
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: [imageSchema],
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  category: {
    type: String,
    enum: ['trending', 'room', 'mountains', 'castles', 'pools', 'homes', 'farms', 'camping'],
    required: true,
  },
  submittedAt: {
    type: Date,
  },
});

//Mongoose MiddleWare
listingSchema.post("findOneAndDelete", async(listing)=> {
  if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;