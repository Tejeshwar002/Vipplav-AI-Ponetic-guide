const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/excel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'xyz123',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/telugu_words' }),
    cookie: { maxAge: 60000 } // Session expires after 60 seconds
}));

// Session expiration middleware
app.use(async (req, res, next) => {
    if (req.session) {
        const now = Date.now();
        if (!req.session.viewedItems) {
            req.session.viewedItems = [];
        }

        if (req.session.lastAccess && now - req.session.lastAccess > req.session.cookie.maxAge) {
            // Session expired
            const Telugu_Words = require('./models/telugu_words');
            const SavedTelugu_Words = require('./models/saved_telugu_words');

            for (const itemId of req.session.viewedItems) {
                const textData = await Telugu_Words.findById(itemId);
                if (textData) {
                    const savedTextData = new SavedTelugu_Words(textData.toObject());
                    await savedTextData.save();
                    await Telugu_Words.findByIdAndDelete(itemId);
                }
            }

            req.session.destroy(err => {
                if (err) {
                    return next(err);
                }
                res.send('Session expired and data saved');
            });
        } else {
            req.session.lastAccess = now;
            next();
        }
    } else {
        next();
    }
});

// Routes
const teluguRoutes = require('./routes/telugu');
app.use('/api', (req, res, next) => {
    req.session.viewedItems = req.session.viewedItems || [];
    next();
}, teluguRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
