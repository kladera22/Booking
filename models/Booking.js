const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema ({
    package_id: {
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Booking', BookingSchema)