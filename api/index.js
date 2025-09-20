const serverless = require("serverless-http");
const server = require("../backend/server/vercel-server.js");
console.log(">>> API function loaded successfully");
module.exports = serverless(server);
