const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const session = require('express-session');
const setUser = require('./middlewares/setUser');

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


app.use(session({
    secret: 'kunci-inggris', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use(setUser);
app.use('/', require('./routes/index'));
app.use('/api/chats', require('./routes/chatRoutes'));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
