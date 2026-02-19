const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true, select:false},
    image: {type: String},
    role: {type: String, enum:['user','admin']},
    phoneNumber:{type: String, trim: true},
    address:{type: String, trim: true},
    country:{type: String, trim: true},
    state:{type: String, trim: true},
    city:{type: String, trim: true},
    gender:{type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say']},
    birthday:{type: Date},
    accountStatus:{type: String, enum: ['Active', 'Inactive', 'Suspended', 'Pending'], default:'Active'},
    createdAt: { type: Date, default: Date.now },

})

const userModel = mongoose.model("Minicart_collection", userSchema)
module.exports = userModel