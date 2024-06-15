import { openai } from '../config.js';
import fs from "fs";
import path from "path";

const speechFile = path.resolve("./speech.mp3");

export default async function speech_impl(req, res) {
    // get prompt from the form data
    const messages = req.body.messages;
    console.log("SPEECH MESSAGES: ", messages);
    console.log("SPEECH PROMPT: ", messages[messages.length - 1].content);
    if(!messages) {
        res.status(400).json({ error: "Missing prompt" });
        return;
    }

    // send the prompt to the OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            ...messages
        ],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: response.choices[0].message.content
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // send the response as json
    res.sendFile(speechFile, (err) => {
        if (err) {
            console.error('Error sending the file:', err);
            res.status(500).send('An error occurred while sending the file.');
        }
    });
}