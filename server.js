const http = require('http');
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const session = require('express-session');
const setUser = require('./middlewares/setUser');

const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

console.log("🚀 Server starting...");;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('view cache', false);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
  });

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


// Websocket server
wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        console.log("Received:", data);

        if (data.type === "sendMessage") {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "newMessage", pesan: data.pesan }));
                }
            });
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
