const express = require('express');
const authRouter = require('./routes/auth');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(bodyParser.json());
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});