const express = require('express');
const router = express.Router();
const {
    getPackages,
    postPackage,
    deletePackages,
    getPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

const reqRecievedLogger = require('../middlewares/reqRecievedLogger');
const {
    packageValidator,
    adminValidator,
} = require('../middlewares/utils/validators');

const protectedRoute = require('../middlewares/auth')

router.route('/')
    .get(reqRecievedLogger, getPackages)
    .post(reqRecievedLogger, protectedRoute, adminValidator, packageValidator, postPackage)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackages)

router.route('/:packageId')
    .get(reqRecievedLogger, getPackage)
    .put(reqRecievedLogger, protectedRoute, adminValidator, updatePackage)
    .delete(reqRecievedLogger, protectedRoute, adminValidator, deletePackage)

module.exports = router;
