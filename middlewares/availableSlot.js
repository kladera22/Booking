const Package = require("../models/Package")
const User = require("../models/User")

const alreadyBooked = async (req, res, next) => {
    const package = await Package.findById(req.params.packageId)
    const user = await User.findById(req.body.user)
    const bookings = package.bookings

    if(user === bookings){
        next()
    } 
    else {
        res
        .status(400)
        .setHeader('Content-Type', 'text/plain')
        .json({
            success: false, msg: 'Bookings Full'
        })
    }
}

const availableSlot = async (req, res, next) => {
    const package = await Package.findById(req.params.packageId)
    const bookings = package.bookings
    const max = package.slot


    if(!(bookings.length === max)){
        next()
    } 
    else {
        res
        .status(400)
        .setHeader('Content-Type', 'text/plain')
        .json({
            success: false, msg: 'Bookings Full'
        })
    }
}

module.exports = {
    availableSlot,
    alreadyBooked
}

