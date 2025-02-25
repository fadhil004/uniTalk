const { Server } = require("socket.io");
const WebSocket = require("ws");
const { Chat, Partner } = require("../models");

const activeUsers = new Map();

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", async (socket) => {
        const { api_key, id_sender } = socket.handshake.query;

        // Validasi API Key
        const partner = await Partner.findOne({ where: { api_key } });
        if (!partner) {
            socket.emit("auth_error", "Invalid API Key");
            socket.disconnect();
            return;
        }

        socket.partnerId = partner.id;
        socket.id_sender = id_sender;

        socket.emit("auth_success", "Authenticated successfully");

        // Bergabung ke room berdasarkan partnerId
        socket.join(socket.partnerId);

        // Menerima pesan dari user
        socket.on("sendMessage", async (data) => {
            const { id_receiver, id_reference, pesan, attachment } = data;

            if (!pesan && !attachment) {
                socket.emit("error", "Message or attachment is required!");
                return;
            }

            const newMessage = await Chat.create({
                partnerId: socket.partnerId,
                id_sender: socket.id_sender,
                id_receiver,
                id_reference,
                pesan,
                attachment,
                edited: false
            });

            // Emit pesan baru ke room yang sesuai
            io.to(id_receiver || socket.partnerId).emit("newMessage", newMessage);
        }); 

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        console.log("🔗 New WebSocket connection");

        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message);

                // Event saat user mengetik
                if (data.type === "typing") {
                    ws.partnerId = data.partnerId;
                    ws.userId = data.userId;
                    ws.room = data.room; // Bisa berupa id_reference (private) atau group_id (grup)

                    // Broadcast "typing" ke semua user dalam room yang sama
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState === WebSocket.OPEN && client.room === data.room) {
                            client.send(JSON.stringify({
                                type: "typing",
                                userId: data.userId,
                                room: data.room
                            }));
                        }
                    });
                }

                // Event saat user berhenti mengetik
                if (data.type === "stop_typing") {
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState === WebSocket.OPEN && client.room === data.room) {
                            client.send(JSON.stringify({
                                type: "stop_typing",
                                userId: data.userId,
                                room: data.room
                            }));
                        }
                    });
                }
            } catch (error) {
                console.error("Error handling WebSocket message:", error);
            }
        });

        ws.on("close", () => {
            console.log("❌ WebSocket disconnected");
            activeUsers.delete(ws.userId);
        });
    });

    return wss;
};