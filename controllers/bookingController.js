const Booking = require('../models/Booking');

const getBookings = async (req, res, next) => {
    // when you hit getBooking endpoint it should display a response of
    // package_id: 1234
    //     [list of user_id and its detials...]
}

const postBooking = async (req, res, next) => {
    // when you hit postBooking endpoint you will input the existing package_id and should display a response of
    // package_id: 1234
    //      [the user_id of bookerist and its details]
}

const deleteBookings = async (req, res, next) => {
    // only the admin can delete all bookings made
}

const getBooking = async (req, res, next) => {
    // when you hit getBooking endpoint it should display a response of
    // package_id: 1234
    //     [list of user_id and its detials...]
}

const updateBooking = async (req, res, next) => {
    // when you hit updateBooking endpoint only the product_id can be change
    // the previous product_id will +1 to the slot
    // and the desired product_id will -1 to the slot
    // response will be the new product_id and the users details 
}

const deleteBooking = async (req, res, next) => {
    // only the admin can delete specific bookings made
    // if it was successfuly deleted the product_id will +1 to the slot

}


module.exports = {
    getBookings,
    postBooking,
    deleteBookings,
    getBooking,
    updateBooking,
    deleteBooking
}


