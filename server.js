const http = require('http');
const { Server } = require('socket.io')

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const session = require('express-session');
const setUser = require('./middlewares/setUser');

const { Chat, Partner } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
    }
});

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

const users = {};

io.on('connection', async (socket) => {
    console.log("User connected:", socket.id);
    const id_sender = socket.handshake.query.id_sender;
    console.log(id_sender)
    console.log(socket.handshake.query.id_sender)
    users[id_sender] = socket.id;

    // Menerima dan memproses pesan dari klien
    socket.on('sendMessage', async (data) => {
        const { api_key, id_sender, id_receiver, pesan, id_reference, attachment } = data;
        const receiverSocketId = users[id_receiver];

        // Validasi API Key
        const partner = await Partner.findOne({ where: { api_key } });
        if (!partner) {
            socket.emit('auth_error', 'Invalid API Key');
            return;
        }

        // Simpan pesan ke database
        const newMessage = await Chat.create({
            partnerId: partner.id,
            id_sender,
            id_receiver,
            pesan,
            id_reference,
            attachment,
            edited: false
        });

        // Kirim pesan ke penerima
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        } else{
            console.log("gaada brok")
        }
    });

    // Menangani disconnect
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        delete users[id_sender];
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
