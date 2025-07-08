const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware.js');
const User = require('../models/user.js');
const Listing = require('../models/listing.js');

// Admin Dashboard Route
router.get('/admin', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        const listings = await Listing.find({});
        res.render('admin/dashboard', { users, listings });
    } catch (error) {
        req.flash('error', 'Failed to load admin dashboard');
        res.redirect('/admin');
    }
})

// Delete a User
router.delete('/admin/users/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        req.flash('success', 'User deleted successfully');
        res.redirect('/admin');
    } catch (error) {
        req.flash('error', 'Failed to delete user');
        res.redirect('/admin');
    }
});

module.exports = router;