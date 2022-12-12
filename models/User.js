const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const validator = require ('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema ({
    firstName: {
        type: String,
        Required: true,
        maxLength: 15
    },
    lastName: {
        type: String,
        Required: true,
        maxLength: 15
    },
    username: {
        type: String,
        Unique: true,
        Required: true,
        maxLength: 15
    },
    password: {
        type: String,
        required: true,
        validate: (password) => {
            return validator.isStrongPassword(password)
        }
    },
    age: {
        type: Number,
        required: true,
        validate: (age) => {
            return typeof age === 'number'
        }
    },
    email: {
        type: String,
        required: true,
        validate: (username) => {
            return validator.isEmail(username)
        }
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    admin: {
        type: Boolean,
        default: false
    } 
},{
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next ();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() +10*60*1000

    return resetToken
}

module.exports = mongoose.model('User', UserSchema);