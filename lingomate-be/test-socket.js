const { io } = require("socket.io-client");

// Replace with your WebSocket server URL
const SERVER_URL = "http://localhost:3001";

const clientId = "newMessage";
const userId = 14;
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInJvbGUiOnsiaWQiOjMsIm5hbWUiOiJVc2VyIiwiX19lbnRpdHkiOiJSb2xlRW50aXR5In0sInNlc3Npb25JZCI6NDcsImlhdCI6MTczMjg2MzAxNywiZXhwIjoxNzMyOTQ5NDE3fQ.dmKjBE9utXrRGFTazW2cz2cTJRLjZQY6YJA-_f727sc";

const socket = io(SERVER_URL, { path: "/ws" });

// Log connection status
socket.on("connect", () => {
  console.log(`Connected to server with socket ID: ${socket.id}`);

  // Register the client with the server
  socket.emit("register", { clientId, userId, jwtToken });

  console.log(`Sent registration request for clientId: ${clientId}`);
});

// Handle registration acknowledgment
socket.on("registered", (message) => {
  console.log(`Server response: ${message}`);
});

// Listen for new messages from the server
socket.on("newMessage", (message) => {
  console.log(`Received new message: ${message}`);
});

socket.on("onlineUsers", (message) => {
  console.log(`Received online users: ${message}`);
});

// Handle connection errors
socket.on("connect_error", (err) => {
  console.error(`Connection error: ${err.message}`);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connectError", (err) => {
  console.error(`Connection error: ${err}`);
});
