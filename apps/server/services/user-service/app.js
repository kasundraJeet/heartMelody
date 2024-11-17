const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./src/routers/authRouter');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
