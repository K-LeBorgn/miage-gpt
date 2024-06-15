import { openai } from '../config.js';

export default async function chat_impl(req, res) {
    // get prompt from the form data
    const messages = req.body.messages;
    console.log("MESSAGES: ", messages);
    console.log("PROMPT: ", messages[messages.length - 1].content);
    if(!messages) {
        res.status(400).json({ error: "Missing prompt" });
        return;
    }

    // send the prompt to the OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output Markdown.",
            },
            ...messages,
        ],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    // send the response as json
    console.log("RESPONSE " + response.choices[0].message.content);
    res.json(response);
}