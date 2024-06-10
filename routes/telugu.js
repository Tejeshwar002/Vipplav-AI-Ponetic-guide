const express = require('express');
const router = express.Router();
const Telugu_Words = require('../models/telugu_words');
const SavedTelugu_Words = require('../models/saved_telugu_words');

// Middleware to initialize session if not already done
router.use((req, res, next) => {
    if (!req.session.updatedItems) {
        req.session.updatedItems = [];
    }
    if (!req.session.viewedItems) {
        req.session.viewedItems = [];
    }
    console.log('Session Data:');
    console.log('Updated Items:', req.session.updatedItems);
    console.log('Viewed Items:', req.session.viewedItems);
    next();
});

// Endpoint to get the initial Telugu text
router.get('/telugu-text', async (req, res) => {
    try {
        const textData = await Telugu_Words.findOne();
        if (textData) {
            req.session.viewedItems.push(textData._id.toString());
        }
        res.json(textData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to update the current Telugu text
router.post('/update-telugu-text', async (req, res) => {
    try {
        const { _id, romanisedInputs, phoneticGuide } = req.body;
        const updatedTextData = await Telugu_Words.findByIdAndUpdate(
            _id,
            { romanisedInputs, phoneticGuide },
            { new: true }
        );

        // Add updated text data to the session array
        req.session.updatedItems.push(updatedTextData.toObject());

        res.json(updatedTextData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// New endpoint to save and fetch the next Telugu text
router.post('/save-and-next-telugu-text', async (req, res) => {
    try {
        const { _id, text, romanisedInputs, phoneticGuide } = req.body;

        // Find and update the current Telugu text
        const updatedTextData = await Telugu_Words.findByIdAndUpdate(
            _id,
            { text, romanisedInputs, phoneticGuide },
            { new: true }
        );

        // Add updated text data to the session array
        req.session.updatedItems.push(updatedTextData.toObject());

        // Save the updated text data to the new collection
        await SavedTelugu_Words.create({
            _id: updatedTextData._id,
            text: updatedTextData.text,
            romanisedInputs: updatedTextData.romanisedInputs,
            phoneticGuide: updatedTextData.phoneticGuide
        });

        // Delete the updated text data from the original collection
        await Telugu_Words.findByIdAndDelete(_id);

        // Fetch the next Telugu text
        const nextTextData = await Telugu_Words.findOne({ _id: { $gt: _id } }).sort({ _id: 1 });

        if (nextTextData) {
            req.session.viewedItems.push(nextTextData._id.toString());
            res.json(nextTextData);
        } else {
            res.json({ message: 'No more Telugu text found' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to save session Telugu texts
router.post('/save-session-telugu-texts', async (req, res) => {
    try {
        const updatedItems = req.session.updatedItems;
        if (updatedItems.length > 0) {
            // Save all updated items to the SavedTelugu_Words collection
            await SavedTelugu_Words.insertMany(updatedItems);

            // Delete all saved items from the Telugu_Words collection
            const idsToDelete = updatedItems.map(item => item._id);
            await Telugu_Words.deleteMany({ _id: { $in: idsToDelete } });

            // Clear the session array
            req.session.updatedItems = [];

            res.json({ message: 'All updated texts have been saved and deleted from the original collection' });
        } else {
            res.json({ message: 'No updated texts to save' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to get the next Telugu text
router.get('/next-telugu-text', async (req, res) => {
    try {
        const lastId = req.query.lastId;
        let query = {};
        if (lastId) {
            query = { _id: { $gt: lastId } };
        }
        const textData = await Telugu_Words.find(query).sort({ _id: 1 }).limit(1);
        if (textData.length > 0) {
            req.session.viewedItems.push(textData[0]._id.toString());
            res.json(textData[0]);
        } else {
            res.json({ message: 'No more Telugu text available' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to get the previous Telugu text
router.get('/previous-telugu-text', async (req, res) => {
    try {
        const lastId = req.query.lastId;
        let query = {};
        if (lastId) {
            query = { _id: { $lt: lastId } };
        }
        const textData = await Telugu_Words.find(query).sort({ _id: -1 }).limit(1);
        if (textData.length > 0) {
            req.session.viewedItems.push(textData[0]._id.toString());
            res.json(textData[0]);
        } else {
            res.json({ message: 'No previous Telugu text available' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
