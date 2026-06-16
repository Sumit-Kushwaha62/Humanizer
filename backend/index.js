require('dotenv').config();
const express = require('express');
const cors = require('cors');

const humanizeRouter = require('./routes/humanize');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://humanizer-frontend-ji1t.onrender.com'
  ]
}));

app.use(express.json());

app.use('/api/humanize', humanizeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));