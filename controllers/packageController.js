const Package = require('../models/Package')
const User = require('../models/User')
const nodemailer = require('nodemailer')

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
        const package = await Package.findById(req.params.packageId).populate('bookings',['firstName','lastName','username','age','email'])

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(package)
                
    } catch (err) {
        throw new Error(`Error retrieving bookings: ${err.message}`)
    }
}

const postPackageBooking = async (req, res, next) => {
    const emailTransporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'LetsGoTravelAndTour@outlook.com',
            pass: 'Letsgotravel&tour'
        }
    });
    try {
        const package = await Package.findById(req.params.packageId)
        const user = await User.findById(req.body.user)
        
        user.books.push(package)
        package.bookings.push(user)

        await user.save()
        await package.save()

        const booking = await Package.findById(req.params.packageId).populate('bookings',['firstName','lastName','username','age','email'])

        const toCustomerEmail = {
            from: 'LetsGoTravelAndTour@outlook.com',
            to: user.email,
            subject: 'Booking Confirm',
            html: 
            `<h2> Dear ${user.firstName} ${user.lastName}, </h2>

            <p> Congratulations! 
            Your booking has been confirmed. Thank you for choosing our service. 
            We look forward to welcoming you on your chosen date and providing you with an unforgettable experience. 
            Please make sure to bring a printed copy of your booking confirmation, as well as any necessary documents, with you on the day of your booking. 
            If you have any questions or concerns, don't hesitate to contact us. We hope you have a wonderful time with us! </p>

            Best regards, <br>
            <b> ${`Let's Go Travel & Tour`}
            `
        }

    emailTransporter.sendMail(toCustomerEmail, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
      
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
        const booking = package.bookings.find(booking => (booking._id))

        if (booking) {
            const user = await User.findById(booking._id)
            console.log(user)
            const bookIndexPosition = package.bookings.indexOf(user)
            user.books.splice(bookIndexPosition, 1)
            console.log(user)
            await user.save()
        }
    
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
        const package = await Package.findById(req.params.packageId).populate('bookings',['firstName','lastName','username','age','email'])

        let booking = package.bookings.find(booking => (booking._id).equals(req.params.userId))
        
        if(!booking) {booking = {success:false, msg: `No booking found with user id: ${req.params.userId}`}}

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(booking)

    } catch (err) {
        throw new Error(`Error retrieving booking with user id: ${err.message}`)
    }
}

const deletePackageBooking = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        let booking = package.bookings.find(booking => (booking._id).equals(req.params.userId));

         if (booking) {
            const user = await User.findById(booking._id)
            const bookIndexPosition = package.bookings.indexOf(user)
            user.books.splice(bookIndexPosition, 1)
            await user.save()
        }
        
        if(booking) {
            const bookingIndexPosition = package.bookings.indexOf(booking);
            package.bookings.splice(bookingIndexPosition, 1);
            await package.save();
        }
        else {
            booking = {success:false, msg: `No booking found with user id: ${req.params.userId}`}
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `Delete booking with user with id:${req.params.userId}`
        })

    } catch (err) {
        throw new Error(`Error deleting booking with user id: ${err.message}`)
    }
}
//////////////////////////////////////////////////////////////////
const getPackageRatings = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        const ratings = package.ratings;
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(ratings)
                
    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}

const postPackageRating = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        package.ratings.push(req.body);
        const result = await package.save();

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(result)
    }
    catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}
const deletePackageRatings = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        package.ratings = [];
        await package.save();
      
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `delete all ratings for package id:${req.params.packageId}`
        })
    }
    catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`);
    }
}

const getPackageRating = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        const rating = package.ratings.find(rating => (rating._id).equals(req.params.ratingId))

        if(!rating) {rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}}

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(rating)
    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
    }
}
const updatePackageRating = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        let rating = package.ratings.find(rating => (rating._id).equals(req.params.ratingId))
            if(rating) {
                const ratingIndexPosition = package.ratings.indexOf(rating);
                package.ratings.splice(ratingIndexPosition, 1, req.body);
                rating = package.ratings[ratingIndexPosition];
                await package.save();
            }
            else {
                rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}
            }
        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(rating)

    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
    }
}
const deletePackageRating = async (req, res, next) => {
    try {
        const package = await Package.findById(req.params.packageId);
        let rating = package.ratings.find(rating => (rating._id).equals(req.params.ratingId));
        
        if(rating) {
            const ratingIndexPosition = package.ratings.indexOf(rating);
            package.ratings.splice(ratingIndexPosition, 1);
            await package.save();
        }
        else {
            rating = {success:false, msg: `No rating found with rating id: ${req.params.ratingId}`}
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            success: true, msg: `delete rating with id:${req.params.ratingId}`
        })

    } catch (err) {
        throw new Error(`Error retrieving ratings: ${err.message}`)
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
    deletePackageBooking,
    getPackageRatings,
    postPackageRating,
    deletePackageRatings,
    getPackageRating,
    updatePackageRating,
    deletePackageRating
}


