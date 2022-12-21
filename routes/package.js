const express = require('express');
const router = express.Router();
const {
    getPackages,
    postPackage,
    deletePackages,
    getPackage,
    updatePackage,
    deletePackage,
    getPackageBookings,
    postPackageBooking,
    deletePackageBookings,
    getPackageBooking,
    deletePackageBooking,
    getPackageRatings,
    postPackageRating,
    deletePackageRatings,
    getPackageRating,
    updatePackageRating,
    deletePackageRating
} = require('../controllers/packageController');

const reqRecievedLogger = require('../middlewares/reqRecievedLogger');
const {
    packageValidator,
    adminValidator
} = require('../middlewares/utils/validators');

const protectedRoute = require('../middlewares/auth')
const {
    availableSlot,
    alreadyBooked
 } = require('../middlewares/availableSlot')


router.route('/')
    .get(reqRecievedLogger, getPackages)
    .post(reqRecievedLogger, protectedRoute, adminValidator, packageValidator, postPackage)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackages)

router.route('/:packageId')
    .get(reqRecievedLogger, getPackage)
    .put(reqRecievedLogger, protectedRoute, adminValidator, updatePackage)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackage)

router.route('/:packageId/bookings')
    .get(reqRecievedLogger, getPackageBookings) 
    .post(reqRecievedLogger, availableSlot, alreadyBooked, postPackageBooking)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackageBookings)
    
router.route('/:packageId/bookings/:userId')
    .get(reqRecievedLogger, getPackageBooking)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackageBooking)

router.route('/:packageId/ratings')
    .get(reqRecievedLogger, getPackageRatings) 
    .post(reqRecievedLogger, protectedRoute, postPackageRating)
    .delete(reqRecievedLogger, protectedRoute, deletePackageRatings)
    
router.route('/:packageId/ratings/:ratingId')
    .get(reqRecievedLogger, getPackageRating) 
    .put(reqRecievedLogger, protectedRoute, updatePackageRating)
    .delete(reqRecievedLogger, protectedRoute, deletePackageRating)

module.exports = router;
