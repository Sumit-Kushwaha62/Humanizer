const express = require('express');
const cors = require('cors');
require('dotenv').config();

const humanizeRouter = require('./routes/humanize');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/humanize', humanizeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));