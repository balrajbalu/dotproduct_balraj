const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('../configurations/database');

const userRoute = require('../routes/user');
const budgetRoute = require('../routes/budget');
const transactionRoute = require('../routes/transaction');
const categoryRoute= require('../routes/category');
const summaryRoute = require('../routes/summary');
const app = express();
connectDB();
app.use(cookieParser());
app.use(bodyParser.json({ limit: '4mb' }));
const allowedOrigins = [
    process.env.CLIENT_URL,
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/user', userRoute);
app.use('/budget',budgetRoute);
app.use('/transaction', transactionRoute);
app.use('/category', categoryRoute);
app.use('/summary', summaryRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.SERVER_URL}`);
});
app.get('/', (req, res) => {
    res.json({ Message: 'server running' })
})