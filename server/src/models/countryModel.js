const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: { type: String, required: true },
    phoneCode: {type: String, required: true},
    status: {type: Boolean},
    
},{timestamps: true});

const countryModel = mongoose.model('country', countrySchema);
module.exports = countryModel