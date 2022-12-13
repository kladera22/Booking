const express = require('express');
const router = express.Router();
const {
    getBookings,
    postBooking,
    deleteBookings,
    getBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');

const reqRecievedLogger = require('../middlewares/reqRecievedLogger');
const {
    packageValidator,
    adminValidator,
    customValidator,
    bookingValidator
} = require('../middlewares/utils/validators');

const protectedRoute = require('../middlewares/auth')

router.route('/')
    .get(reqRecievedLogger, adminValidator, getBookings)
    .post(reqRecievedLogger, protectedRoute, customValidator, bookingValidator, postBooking)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deleteBookings)

router.route('/:bookingId')
    .get(reqRecievedLogger, getBooking)
    .put(reqRecievedLogger, protectedRoute, adminValidator, updateBooking)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deleteBooking)

module.exports = router;
