if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Store session in MongoDB
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js")
const reviewsRouter =  require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl, // time period in seconds after which the session will be updated
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,     // secret for encrypting session data
});

store.on("error", ()=> {
    console.log("Session store error");
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}



// app.get("/", (req,res) => {
//     res.send("Hi, I am root")
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // A session is required for passport to work
passport.use(new localStrategy(User.authenticate())); // Use local strategy for authentication
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    //console.log("req.flash", req.flash("success"));
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make currentUser available in all views
    next();
});

//Parent routes
app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);


app.all("*", (req, res, next) => {
    console.log("req.originalUrl", req.originalUrl);
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("server is listening to port 8080");
});