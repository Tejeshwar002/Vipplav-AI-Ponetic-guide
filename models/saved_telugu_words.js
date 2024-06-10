const mongoose = require('mongoose');

const savedTeluguTextSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    text: { type: String, required: true },
    romanisedInputs: String,
    phoneticGuide: String,
});

const SavedTelugu_Words = mongoose.model('SavedTelugu_Words', savedTeluguTextSchema, 'saved');

module.exports = SavedTelugu_Words;
