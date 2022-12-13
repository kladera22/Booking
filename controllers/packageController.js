const Package = require('../models/Package');

const getPackages = async (req, res, next) => {

    const filter = {};
    const options = {};

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
            age: sortByPrice === 'asc' ? 1 : -1 
        }
    }

    try {
        const packages = await Package.find({}, filter, options);

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .json(packages)
        
    } catch (err) {
        throw new Error (`Error retrieving packages: ${err.message}`);
    }
}

const postPackage = async (req, res, next) => {

    try {
        const package = await Package.create(req.body);

        res
        .status(201)
        .setHeader('Content-Type', 'application/json')
        .json(package)

    } catch (err) {
        throw new Error (`Error creating package: ${err.message}`);
    }
}

const deletePackages = async (req, res, next) => {

    try {
        await Package.deleteMany();

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
        const package = await Package.findById(req.params.packageId);

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
        });

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


module.exports = {
    getPackages,
    postPackage,
    deletePackages,
    getPackage,
    updatePackage,
    deletePackage
}


