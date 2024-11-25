const { io } = require("socket.io-client");

// Replace with your WebSocket server URL
const SERVER_URL = "http://localhost:3001";

const clientId = "newMessage";
const conversationId = "d7f593f5-cd9d-48ac-9864-0d0753ab4997";

const socket = io(SERVER_URL);

// Log connection status
socket.on("connect", () => {
  console.log(`Connected to server with socket ID: ${socket.id}`);

  // Register the client with the server
  socket.emit("register", { clientId, conversationId });

  console.log(`Sent registration request for clientId: ${clientId}`);
});

// Handle registration acknowledgment
socket.on("registered", (message) => {
  console.log(`Server response: ${message}`);
});

// Listen for new messages from the server
socket.on("message", (message) => {
  console.log(`Received new message: ${message}`);
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}`);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
