const mongoose = require('mongoose');
const Counter = require('./counter');

const teluguTextSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    text: { type: String, required: true },
    romanisedInputs: String,
    phoneticGuide: String,
});

// Middleware to auto-increment _id before saving a new document
teluguTextSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'telugu_word_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        doc._id = counter.seq;
    }
    next();
});

const Telugu_Words = mongoose.model('Telugu_Words', teluguTextSchema, 'new');

module.exports = Telugu_Words;
