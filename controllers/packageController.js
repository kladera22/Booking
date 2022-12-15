const Package = require('../models/Package')
const User = require('../models/User')


const getPackages = async (req, res, next) => {

    const filter = {}
    const options = {}

    if(Object.keys(req.query).length){
        const{
            title,
            startDate,
            endDate,
            price,
            destination,
            tourIncludes,
            slot,
            limit,
            sortByPrice
        } = req.query

        if(title)filter.title = true
        if(startDate)filter.startDate = true
        if(endDate)filter.endDate = true
        if(price)filter.price = true
        if(destination)filter.destination = true
        if(tourIncludes)filter.tourIncludes = true
        if(slot)filter.slot = true
      
        if(limit)options.limit = limit
        if(sortByPrice) options.sort = {
            price: sortByPrice === 'asc' ? 1 : -1 
        }
    }

    try {
        const packages = await Package.find({}, filter, options)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(packages)
        
    } catch (err) {
        throw new Error (`Error retrieving packages: ${err.message}`)
    }
}

const postPackage = async (req, res, next) => {

    try {
        const package = await Package.create(req.body)

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(package)

    } catch (err) {
        throw new Error (`Error creating package: ${err.message}`)
    }
}

const deletePackages = async (req, res, next) => {

    try {
        await Package.deleteMany()

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: 'Delete all packages'
        })
    } catch (err) {
        throw new Error (`Error deleting packages: ${err.message}`)
    }
}

const getPackage = async (req, res, next) => {

    try {
        const package = await Package.findById(req.params.packageId)

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(package)

    } catch (err) {
        throw new Error (`Error getting package(s) with id: ${req.params.packageId}, ${err.message}`)
    }
}

const updatePackage = async (req, res, next) => {

    try {
        const package = await Package.findByIdAndUpdate(req.params.packageId, {
            $set: req.body
        },{
            new: true,
        })

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(package)

    } catch (err) {
        throw new Error (`Error updating package(s) with id: ${req.params.packageId}, ${err.message}`)
    }
}

const deletePackage = async (req, res, next) => {

    try {
        await Package.findByIdAndDelete(req.params.packageId)
    } catch (err) {
        throw new Error (`Error deleting package(s) with id: ${req.params.packageId}, ${err.message}`)
    }
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
        success: true, msg: `Delete package id: ${req.params.packageId}`
    })
}

const getPackageBookings = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId)
      //  const bookings = package.bookings.find().populate('BookingSchema')

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(package)
                
    } catch (err) {
        throw new Error(`Error retrieving bookings: ${err.message}`)
    }
}

const postPackageBooking = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId)
        console.log(package)

        const user = await User.findById(req.body.user)
        package.bookings.push(user)

        console.log('this is a user', user)
    
        const booking = await package.save()
      
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(booking)
    }

    catch (err) {
        throw new Error(`Error creating bookings: ${err.message}`)
    }
}

const deletePackageBookings = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId)
        package.bookings = []

        await package.save()
      
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `Delete all bookings for package id:${req.params.packageId}`
        })
    }

    catch (err) {
        throw new Error(`Error deleting bookings: ${err.message}`)
    }
}

const getPackageBooking = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        const booking = package.bookings.find(booking => (booking._id).equals(req.params.bookingId))

        if(!booking) {booking = {success:false, msg: `No booking found with booking id: ${req.params.bookingId}`}}

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(booking)

    } catch (err) {
        throw new Error(`Error retrieving booking id: ${err.message}`)
    }
}

const updatePackageBooking = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        let booking = package.bookings.find(booking => (booking._id).equals(req.params.bookingId))

            if(booking) {
                const bookingIndexPosition = package.bookings.indexOf(booking);
                package.bookings.splice(bookingIndexPosition, 1, req.body);
                booking = package.bookings[bookingIndexPosition];
                await package.save();
            }
            else {
                booking = {success:false, msg: `No booking found with booking id: ${req.params.bookingId}`}
            }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(booking)

    } catch (err) {
        throw new Error(`Error updating booking id: ${err.message}`)
    }
}

const deletePackageBooking = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        let booking = package.bookings.find(booking => (booking._id).equals(req.params.bookingId));
        
        if(booking) {
            const bookingIndexPosition = package.bookings.indexOf(booking);
            package.bookings.splice(bookingIndexPosition, 1);
            await package.save();
        }
        else {
            booking = {success:false, msg: `No booking found with booking id: ${req.params.bookingId}`}
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `Delete booking with id:${req.params.bookingId}`
        })

    } catch (err) {
        throw new Error(`Error deleting booking id: ${err.message}`)
    }
}


module.exports = {
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
    updatePackageBooking,
    deletePackageBooking
}


