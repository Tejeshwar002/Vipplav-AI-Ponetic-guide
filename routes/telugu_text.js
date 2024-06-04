const express = require('express');
const router = express.Router();
const Telugu_Words = require('../models/telugu_words'); // Import the Telugu_Words model

router.get('/telugu-text', async (req, res) => {
    try {
        const textData = await Telugu_Words.findOne();
        res.json(textData);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update-telugu-text', async (req, res) => {
    try {
        const { _id, romanisedInputs, phoneticGuide } = req.body;

        // Update the document with the given _id
        const updatedTextData = await Telugu_Words.findByIdAndUpdate(
            _id,
            { romanisedInputs, phoneticGuide },
            { new: true }
        );

        res.json(updatedTextData);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/next-telugu-text', async (req, res) => {
    try {
        const lastId = parseInt(req.query.lastId, 10);
        let query = {};

        if (lastId) {
            query = { _id: { $gt: lastId } };
        }

        const textData = await Telugu_Words.find(query).sort({ _id: 1 }).limit(1);

        if (textData.length > 0) {
            res.json(textData[0]);
        } else {
            res.json({ message: 'No more text available' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/previous-telugu-text', async (req, res) => {
    try {
        const lastId = parseInt(req.query.lastId, 10);
        let query = {};

        if (lastId) {
            query = { _id: { $lt: lastId } };
        }

        const textData = await Telugu_Words.find(query).sort({ _id: -1 }).limit(1);

        if (textData.length > 0) {
            res.json(textData[0]);
        } else {
            res.json({ message: 'No previous text available' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Telugu_Words = require('../models/telugu_words'); // Import the Telugu_Words model

// // Route to get the initial Telugu text
// router.get('/telugu-text', async (req, res) => {
//     try {
//         const textData = await Telugu_Words.findOne();
//         res.json(textData);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Route to update the current Telugu text
// router.post('/update-telugu-text', async (req, res) => {
//     try {
//         const { _id, romanisedInputs, phoneticGuide } = req.body;

//         // Update the document with the given _id
//         const updatedTextData = await Telugu_Words.findByIdAndUpdate(
//             _id,
//             { romanisedInputs, phoneticGuide },
//             { new: true }
//         );

//         res.json(updatedTextData);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Route to get the next Telugu text
// router.get('/next-telugu-text', async (req, res) => {
//     try {
//         const lastId = req.query.lastId;

//         let query = { _id: { $gt: lastId }, romanisedInputs: "", phoneticGuide: "" };

//         const textData = await Telugu_Words.find(query).sort({ _id: 1 }).limit(1);

//         if (textData.length > 0) {
//             res.json(textData[0]);
//         } else {
//             res.json({ message: 'No more text available' });
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Route to get the previous Telugu text
// router.get('/previous-telugu-text', async (req, res) => {
//     try {
//         const lastId = req.query.lastId;

//         let query = { _id: { $lt: lastId }, romanisedInputs: "", phoneticGuide: "" };

//         const textData = await Telugu_Words.find(query).sort({ _id: -1 }).limit(1);

//         if (textData.length > 0) {
//             res.json(textData[0]);
//         } else {
//             res.json({ message: 'No previous text available' });
//         }
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// module.exports = router;
