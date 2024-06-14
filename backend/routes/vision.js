import { openai } from '../config.js';

export default async function vision_impl(req, res) {
    // get prompt from the form data
    const prompt = req.body.prompt;
    const images = req.body.images;

    console.log("VISION PROMPT: ", prompt);
    console.log("VISION IMAGES LENGTH: ", images.length);

    if(!images || !prompt) {
        res.status(400).json({ error: "Missing images or prompt" });
        return;
    }

    const imagesSources = [];
    for(const image of images) {
        imagesSources.push(
            {
                type: "image_url",
                image_url: {
                    "url": image
                },
            }
        );
    }

    // send the prompt to the OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output Markdown.",
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    ...imagesSources
                ],
            },
        ],
    });

    // send the response as json
    console.log("RESPONSE " + response.choices[0].message.content);
    res.json(response);
}