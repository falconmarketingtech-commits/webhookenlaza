// app.js
const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Health check (optional)
app.get("/", (req, res) => res.status(200).send("OK"));

// Webhook verification (GET /webhook)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Webhook receiver (POST /webhook)
app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
  console.log("GET  /webhook -> verification");
  console.log("POST /webhook -> events\n");
});
