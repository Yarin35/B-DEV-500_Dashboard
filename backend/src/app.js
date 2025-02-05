const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Server is ready!');
});

app.use(cors());

app.use(bodyParser.json());
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});