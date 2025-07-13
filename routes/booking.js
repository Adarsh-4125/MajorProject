const express = require('express');
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const bookingsController = require('../controllers/bookings');
const { isLoggedIn } = require('../middleware');

router.get('/listings/:id/book', wrapAsync(bookingsController.renderNewBooking));// renders the booking form
router.post('/listings/:id/book', isLoggedIn, wrapAsync(bookingsController.createBooking));// handles the booking submission
 
//payment flow
router.get('/bookings/:id/payment',isLoggedIn, wrapAsync(bookingsController.renderPayment));
router.post('/bookings/:id/payment',isLoggedIn,wrapAsync(bookingsController.confirmPayment));

//cancel booking
router.delete('/bookings/:id',isLoggedIn,wrapAsync(bookingsController.cancelBooking));

//show booking
router.get('/bookings/:id', isLoggedIn, wrapAsync(bookingsController.showBooking));// shows user-specific booking details

// User and owner dashboards
router.get('/my-bookings', isLoggedIn, wrapAsync(bookingsController.userBookings));
router.get('/owner/bookings', isLoggedIn, wrapAsync(bookingsController.ownerBookings));


module.exports = router;