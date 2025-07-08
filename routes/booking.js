const express = require('express');
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const bookingsController = require('../controllers/bookings');

router.get('/listings/:id/book', wrapAsync(bookingsController.renderNewBooking));

module.exports = router;