import { openai } from '../config.js';

export default async function image_impl(req, res) {
    // get prompt from the form data
    const prompt = req.body.prompt;
    console.log("IMAGE PROMPT: ", prompt);

    if(!prompt) {
        res.status(400).json({ error: "Missing prompt" });
        return;
    }

    // send the prompt to the OpenAI Dall-E 2 API
    const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1, // nombre de variations
        size: "256x256",
    });

    // send the response as json
    res.json(response);
}