const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/config');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Routes
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
