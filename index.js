const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tokenChecker = require('./Middleware/tokenChecker');

const app = express();
const PORT = 2000;

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

// app.use(tokenChecker);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./Router/authRouter');
const cmsRouter = require('./Router/cmsRouter');

app.use('/auth', authRouter);
app.use('/cms', cmsRouter);


app.listen(PORT, () => console.log(`API Running at http://localhost:${PORT}`));