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
const { uploadSingle } = require('./helpers/uploadAttachments');

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
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
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
    console.log("Id Sender:", id_sender)
    users[id_sender] = socket.id;

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group ${groupId}`);
    });

    // Menerima dan memproses pesan dari klien
    socket.on('sendMessage', async (data) => {
        const { api_key, id_sender, id_receiver, pesan, id_reference } = data;

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
            id_reference,
            pesan,
            edited: false
        });

        if (id_reference) {
            // Emit pesan ke semua anggota grup
            io.to(id_reference).emit('newMessage', newMessage);
        } else {
            // Emit pesan ke penerima individu
            const receiverSocketId = users[id_receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }
        }
    });
    

    //upload attachments
    app.post('/upload', uploadSingle('attachment'), async (req,res) =>{
        try {    
            const { api_key, id_sender, id_receiver, id_reference } = req.body;
            if(!req.file) {
                return res.status(400).send('No file uploaded!');
            }

            // Validasi API Key
            const partner = await Partner.findOne({ where: { api_key } });
            if (!partner) {
                socket.emit('auth_error', 'Invalid API Key');
                return;
            }

            const newAttachment = await Chat.create({
                partnerId: partner.id,
                id_sender,
                id_receiver,
                id_reference,
                attachment: req.file.filename,
                edited: false
            });
            if (id_reference) {
                // Emit pesan ke semua anggota grup
                io.to(id_reference).emit('newAttachment', newAttachment);
            } else {
                // Emit pesan ke penerima individu
                const receiverSocketId = users[id_receiver];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newAttachment', newAttachment);
                }
            }
            res.status(200).json({ message: 'File uploaded successfully', data: newAttachment });
        } catch (error) {
            res.status(400).json({message: 'error uploading file!', error: error.message});
        }
    })

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
