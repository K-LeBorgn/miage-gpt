import { openai } from '../config.js';

export default async function vision_impl(req, res) {
    // get prompt from the form data
    const messages = req.body.messages;
    const images = req.body.images;

    console.log("MESSAGES: ", messages);
    console.log("PROMPT: ", messages[messages.length - 1].content);
    console.log("VISION IMAGES LENGTH: ", images.length);

    if(!images || !messages) {
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
    const prompt = messages[messages.length - 1].content;
    messages.pop(); // remove the last message from the prompt
    messages.push(
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                ...imagesSources
            ],
        }
    )


    // send the prompt to the OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output Markdown.",
            },
            ...messages,
        ],
    });

    // send the response as json
    console.log("RESPONSE " + response.choices[0].message.content);
    res.json(response);
}