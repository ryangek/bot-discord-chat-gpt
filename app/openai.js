const { Configuration, OpenAIApi } = require('openai');
const { GPT_MODEL, GPT_KEY } = require('../config.json');
const chatModel = GPT_MODEL;
console.log(`The system is using OpenAI Model...<< ${chatModel} >>`);

const configuration = new Configuration({
    apiKey: GPT_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatGPT(message) {
    let content = '';
    if (message.content.includes('TH/')) {
        content =
            'You will be provided with a sentence in English, and your task is to translate it into Thai.';
    } else if (message.content.includes('EN/')) {
        content =
            'You will be provided with a sentence in Thai, and your task is to translate it into English.';
    }

    if (content) {
        console.log(`Content: ${content}`);
        let messageLog = [
            {
                role: 'system',
                content: content,
            },
        ];

        messageLog.push({
            role: 'user',
            content: message.content,
        });

        const result = await openai.createChatCompletion({
            model: chatModel,
            messages: messageLog,
        });

        if (result && result.data) {
            console.log(result.data.choices[0].message);
            return result.data.choices[0].message.content.substring(3);
        } else {
            return 'Apologize, I cannot translate this content right now !';
        }
    }

    return 'Apologize, I cannot translate this content right now !';
}

module.exports = {
    chatGPT,
};
