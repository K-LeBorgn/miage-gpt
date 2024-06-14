// generate minimal server for api with express
import express from 'express';
import { PORT } from './config.js';
import chat_impl from "./routes/chat.js";
import image_impl from "./routes/image.js";
import speech_impl from "./routes/speech.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = PORT;

// configure CORS support
// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// define routes
app.post('/chat', chat_impl);
app.post('/image', image_impl);
app.post('/speech', speech_impl);

// start server and listen to port 3001
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});