const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema ({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const PackageSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50
    },
    startDate: {
        type: Date,
        Required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value){
                return value >= this.startDate
            }
        }
    },
    price: {
        type: Number,
        required: true
    },
    destination: {
        type: String,
        required: true,
        maxLength: 50
    },
    tourIncludes: {
        type: String,
        required: true,
        maxLength: 100
    },
    slot: {
        type: Number,
        required: true,
        default: 1
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    ratings: [RatingSchema]
},{
    timestamps: true
})

module.exports = mongoose.model('Package', PackageSchema)