const Package = require("../models/Package")
const User = require("../models/User")

const alreadyBooked = async (req, res, next) => {
    const package = await Package.findById(req.params.packageId)
  //  const user = await User.findById(req.body.user)
    let booking = package.bookings.find(booking => (booking._id).equals(req.body.user))

    if(!booking){
        next()
    } 
    else {
        res
        .status(400)
        .setHeader('Content-Type', 'text/plain')
        .json({
            success: false, msg: 'Already Booked'
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

