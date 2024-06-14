import { openai } from '../config.js';

export default async function chat_impl(req, res) {
    // get prompt from the form data
    const prompt = req.body.prompt;
    console.log("PROMPT: ", prompt);

    // send the prompt to the OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature: 1,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    // send the response as json
    res.json(response);
}