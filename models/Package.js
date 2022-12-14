const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema ({
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
        required: true
    },

    bookings: [BookingSchema]
},{
    timestamps: true
})

module.exports = mongoose.model('Package', PackageSchema)